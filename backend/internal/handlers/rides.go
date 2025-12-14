package handlers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/slowtyper/poolie/backend/ent"
	"github.com/slowtyper/poolie/backend/ent/ride"
	"github.com/slowtyper/poolie/backend/internal/models"
	"go.uber.org/zap"
)

// RideHandler handles ride-related HTTP requests
type RideHandler struct {
	db     *ent.Client
	logger *zap.Logger
}

// NewRideHandler creates a new RideHandler
func NewRideHandler(db *ent.Client, logger *zap.Logger) *RideHandler {
	return &RideHandler{
		db:     db,
		logger: logger,
	}
}

// SearchRides handles GET /rides/search
func (h *RideHandler) SearchRides(c fiber.Ctx) error {
	var req models.SearchRidesRequest

	// Fiber v3: Use Bind().Query() instead of QueryParser
	if err := c.Bind().Query(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_REQUEST",
				Message: "Invalid query parameters",
			},
		})
	}

	// Validate required fields
	if req.Origin == "" || req.Destination == "" || req.Date == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "MISSING_PARAMETERS",
				Message: "origin, destination, and date are required",
			},
		})
	}

	// Parse date
	searchDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_DATE",
				Message: "date must be in YYYY-MM-DD format",
			},
		})
	}

	// Build query
	ctx := context.Background()
	query := h.db.Ride.Query().
		Where(
			ride.StatusEQ("active"),
			ride.OriginCityContains(req.Origin),
			ride.DestinationCityContains(req.Destination),
			ride.DepartureTimeGTE(searchDate),
			ride.DepartureTimeLT(searchDate.AddDate(0, 0, 1)),
		).
		WithDriver().
		WithVehicle()

	// Filter by type if specified
	if req.Type != "" && req.Type != "all" {
		query = query.Where(ride.TypeEQ(req.Type))
	}

	// Execute query
	rides, err := query.All(ctx)
	if err != nil {
		h.logger.Error("failed to search rides", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to search rides",
			},
		})
	}

	// Transform to response format
	ridePreviews := make([]models.RidePreview, 0, len(rides))
	carpoolCount := 0
	busCount := 0

	for _, r := range rides {
		if r.Type == "carpool" {
			carpoolCount++
		} else if r.Type == "bus" {
			busCount++
		}

		preview := h.transformToRidePreview(r)
		ridePreviews = append(ridePreviews, preview)
	}

	return c.JSON(models.SearchRidesResponse{
		TotalCount:   len(rides),
		CarpoolCount: carpoolCount,
		BusCount:     busCount,
		Rides:        ridePreviews,
	})
}

// GetRide handles GET /rides/:rideId
func (h *RideHandler) GetRide(c fiber.Ctx) error {
	rideID := c.Params("rideId")

	ctx := context.Background()
	r, err := h.db.Ride.Query().
		Where(ride.IDEQ(rideID)).
		WithDriver().
		WithVehicle().
		Only(ctx)

	if err != nil {
		if ent.IsNotFound(err) {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
				Error: models.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Ride not found",
				},
			})
		}
		h.logger.Error("failed to get ride", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to get ride",
			},
		})
	}

	detail := h.transformToRideDetail(r)
	return c.JSON(detail)
}

// CreateRide handles POST /rides
func (h *RideHandler) CreateRide(c fiber.Ctx) error {
	var req models.CreateRideRequest

	// Fiber v3: Use Bind().Body() instead of BodyParser
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_REQUEST",
				Message: "Invalid request body",
			},
		})
	}

	// Get user ID from context (set by auth middleware)
	userID := c.Locals("user_id").(string)

	// Calculate duration if arrival time is provided
	var durationMinutes *int
	if req.ArrivalTime != nil {
		duration := int(req.ArrivalTime.Sub(req.DepartureTime).Minutes())
		durationMinutes = &duration
	}

	// Create ride
	ctx := context.Background()
	rideID := "ride_" + uuid.New().String()[:8]

	builder := h.db.Ride.Create().
		SetID(rideID).
		SetDriverID(userID).
		SetType("carpool").
		SetRideType(req.RideType).
		SetDepartureTime(req.DepartureTime).
		SetOriginCity(req.Origin.City).
		SetOriginAddress(req.Origin.Address).
		SetDestinationCity(req.Destination.City).
		SetDestinationAddress(req.Destination.Address).
		SetPriceAmount(req.PricePerSeat.Amount).
		SetPriceCurrency(req.PricePerSeat.Currency).
		SetAvailableSeats(req.AvailableSeats).
		SetTotalSeats(req.AvailableSeats)

	if req.Origin.LocationPoint != "" {
		builder = builder.SetOriginLocationPoint(req.Origin.LocationPoint)
	}

	if req.Destination.LocationPoint != "" {
		builder = builder.SetDestinationLocationPoint(req.Destination.LocationPoint)
	}

	if req.ArrivalTime != nil {
		builder = builder.SetArrivalTime(*req.ArrivalTime)
	}

	if durationMinutes != nil {
		builder = builder.SetDurationMinutes(*durationMinutes)
	}

	if req.Amenities != nil {
		builder = builder.SetAmenities(req.Amenities)
	}

	if req.Description != "" {
		builder = builder.SetDescription(req.Description)
	}

	if req.Recurrence != nil {
		recurrenceData := map[string]interface{}{
			"days_of_week": req.Recurrence.DaysOfWeek,
			"start_date":   req.Recurrence.StartDate,
			"end_date":     req.Recurrence.EndDate,
		}
		builder = builder.SetRecurrence(recurrenceData)
	}

	newRide, err := builder.Save(ctx)
	if err != nil {
		h.logger.Error("failed to create ride", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to create ride",
			},
		})
	}

	// Fetch the created ride with relations
	createdRide, err := h.db.Ride.Query().
		Where(ride.IDEQ(newRide.ID)).
		WithDriver().
		WithVehicle().
		Only(ctx)

	if err != nil {
		h.logger.Error("failed to fetch created ride", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Ride created but failed to fetch details",
			},
		})
	}

	detail := h.transformToRideDetail(createdRide)
	return c.Status(fiber.StatusCreated).JSON(detail)
}

// Helper functions to transform entities to response models

func (h *RideHandler) transformToRidePreview(r *ent.Ride) models.RidePreview {
	preview := models.RidePreview{
		RideID:    r.ID,
		Type:      r.Type,
		RideType:  r.RideType,
		DepartureTime: r.DepartureTime,
		Origin: models.Location{
			City:          r.OriginCity,
			Address:       r.OriginAddress,
			LocationPoint: r.OriginLocationPoint,
		},
		Destination: models.Location{
			City:          r.DestinationCity,
			Address:       r.DestinationAddress,
			LocationPoint: r.DestinationLocationPoint,
		},
		Price: models.Price{
			Amount:   r.PriceAmount,
			Currency: r.PriceCurrency,
		},
		AvailableSeats: r.AvailableSeats,
	}

	if r.ArrivalTime != nil {
		preview.ArrivalTime = r.ArrivalTime
	}

	if r.DurationMinutes != nil {
		preview.DurationMinutes = r.DurationMinutes
	}

	if r.Amenities != nil {
		amenities := models.Amenities{}
		if smoking, ok := r.Amenities["smoking_allowed"].(bool); ok {
			amenities.SmokingAllowed = smoking
		}
		if ac, ok := r.Amenities["air_conditioner"].(bool); ok {
			amenities.AirConditioner = ac
		}
		preview.Amenities = amenities
	}

	if r.Edges.Driver != nil {
		preview.Driver = models.Driver{
			UserID:            r.Edges.Driver.ID,
			Name:              r.Edges.Driver.Name,
			Rating:            r.Edges.Driver.Rating,
			RatingCount:       r.Edges.Driver.RatingCount,
			ProfilePictureURL: r.Edges.Driver.ProfilePictureURL,
			IsVerified:        r.Edges.Driver.IsVerified,
		}
	}

	if r.Recurrence != nil {
		recurrence := &models.Recurrence{}
		if daysOfWeek, ok := r.Recurrence["days_of_week"].([]interface{}); ok {
			days := make([]string, len(daysOfWeek))
			for i, day := range daysOfWeek {
				if d, ok := day.(string); ok {
					days[i] = d
				}
			}
			recurrence.DaysOfWeek = days
		}
		if startDate, ok := r.Recurrence["start_date"].(string); ok {
			recurrence.StartDate = startDate
		}
		if endDate, ok := r.Recurrence["end_date"].(string); ok {
			recurrence.EndDate = endDate
		}
		preview.Recurrence = recurrence
	}

	return preview
}

func (h *RideHandler) transformToRideDetail(r *ent.Ride) models.RideDetail {
	detail := models.RideDetail{
		RideID:    r.ID,
		Type:      r.Type,
		RideType:  r.RideType,
		DepartureTime: r.DepartureTime,
		Origin: models.Location{
			City:          r.OriginCity,
			Address:       r.OriginAddress,
			LocationPoint: r.OriginLocationPoint,
		},
		Destination: models.Location{
			City:          r.DestinationCity,
			Address:       r.DestinationAddress,
			LocationPoint: r.DestinationLocationPoint,
		},
		Price: models.Price{
			Amount:   r.PriceAmount,
			Currency: r.PriceCurrency,
		},
		AvailableSeats: r.AvailableSeats,
		BookingPolicies: models.BookingPolicies{
			InstantConfirmation: r.InstantConfirmation,
			CancellationPolicy:  r.CancellationPolicy,
		},
	}

	if r.ArrivalTime != nil {
		detail.ArrivalTime = r.ArrivalTime
	}

	if r.DurationMinutes != nil {
		detail.DurationMinutes = r.DurationMinutes
	}

	if r.Amenities != nil {
		amenities := models.Amenities{}
		if smoking, ok := r.Amenities["smoking_allowed"].(bool); ok {
			amenities.SmokingAllowed = smoking
		}
		if ac, ok := r.Amenities["air_conditioner"].(bool); ok {
			amenities.AirConditioner = ac
		}
		detail.Amenities = amenities
	}

	if r.Edges.Driver != nil {
		detail.Driver = models.Driver{
			UserID:            r.Edges.Driver.ID,
			Name:              r.Edges.Driver.Name,
			Rating:            r.Edges.Driver.Rating,
			RatingCount:       r.Edges.Driver.RatingCount,
			ProfilePictureURL: r.Edges.Driver.ProfilePictureURL,
			IsVerified:        r.Edges.Driver.IsVerified,
		}
	}

	if r.Edges.Vehicle != nil {
		detail.Vehicle = models.Vehicle{
			Make:  r.Edges.Vehicle.Make,
			Model: r.Edges.Vehicle.Model,
			Color: r.Edges.Vehicle.Color,
		}
	}

	if r.Stops != nil && len(r.Stops) > 0 {
		stops := []models.Stop{}
		stopsList := r.Stops
		if stopsList != nil {
			for _, s := range stopsList {
				if stopMap, ok := s.(map[string]interface{}); ok {
					stop := models.Stop{}
					if loc, ok := stopMap["location"].(map[string]interface{}); ok {
						if city, ok := loc["city"].(string); ok {
							stop.Location.City = city
						}
						if addr, ok := loc["address"].(string); ok {
							stop.Location.Address = addr
						}
						if point, ok := loc["location_point"].(string); ok {
							stop.Location.LocationPoint = point
						}
					}
					if timeStr, ok := stopMap["time"].(string); ok {
						if t, err := time.Parse(time.RFC3339, timeStr); err == nil {
							stop.Time = t
						}
					}
					if stopType, ok := stopMap["type"].(string); ok {
						stop.Type = stopType
					}
					stops = append(stops, stop)
				}
			}
		}
		detail.Stops = stops
	}

	if r.Recurrence != nil {
		recurrence := &models.Recurrence{}
		if daysOfWeek, ok := r.Recurrence["days_of_week"].([]interface{}); ok {
			days := make([]string, len(daysOfWeek))
			for i, day := range daysOfWeek {
				if d, ok := day.(string); ok {
					days[i] = d
				}
			}
			recurrence.DaysOfWeek = days
		}
		if startDate, ok := r.Recurrence["start_date"].(string); ok {
			recurrence.StartDate = startDate
		}
		if endDate, ok := r.Recurrence["end_date"].(string); ok {
			recurrence.EndDate = endDate
		}
		detail.Recurrence = recurrence
	}

	return detail
}
