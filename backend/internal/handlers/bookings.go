package handlers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/slowtyper/poolie/backend/ent"
	"github.com/slowtyper/poolie/backend/ent/booking"
	"github.com/slowtyper/poolie/backend/ent/ride"
	"github.com/slowtyper/poolie/backend/internal/models"
	"go.uber.org/zap"
)

// BookingHandler handles booking-related HTTP requests
type BookingHandler struct {
	db     *ent.Client
	logger *zap.Logger
}

// NewBookingHandler creates a new BookingHandler
func NewBookingHandler(db *ent.Client, logger *zap.Logger) *BookingHandler {
	return &BookingHandler{
		db:     db,
		logger: logger,
	}
}

// CreateBooking handles POST /bookings
func (h *BookingHandler) CreateBooking(c fiber.Ctx) error {
	var req models.CreateBookingRequest

	// Fiber v3: Use Bind().Body() instead of BodyParser
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_REQUEST",
				Message: "Invalid request body",
			},
		})
	}

	// Validate required fields
	if req.RideID == "" || req.PassengerCount < 1 {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_REQUEST",
				Message: "ride_id and passenger_count (minimum 1) are required",
			},
		})
	}

	// Get user ID from context (set by auth middleware)
	userID := c.Locals("user_id").(string)

	ctx := context.Background()

	// Check if ride exists and has enough seats
	r, err := h.db.Ride.Query().
		Where(ride.IDEQ(req.RideID)).
		WithDriver().
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
		h.logger.Error("failed to fetch ride", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch ride details",
			},
		})
	}

	// Check if ride is active
	if r.Status != "active" {
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "RIDE_NOT_AVAILABLE",
				Message: "Ride is no longer available",
			},
		})
	}

	// Check available seats
	if r.AvailableSeats < req.PassengerCount {
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INSUFFICIENT_SEATS",
				Message: "Not enough available seats",
			},
		})
	}

	// Calculate total price
	totalPrice := r.PriceAmount * int64(req.PassengerCount)

	// Create booking
	bookingID := "booking_" + uuid.New().String()[:8]

	builder := h.db.Booking.Create().
		SetID(bookingID).
		SetRideID(req.RideID).
		SetPassengerID(userID).
		SetStatus("pending").
		SetPassengerCount(req.PassengerCount).
		SetTotalPriceAmount(totalPrice).
		SetTotalPriceCurrency(r.PriceCurrency)

	if req.Message != "" {
		builder = builder.SetMessage(req.Message)
	}

	newBooking, err := builder.Save(ctx)
	if err != nil {
		h.logger.Error("failed to create booking", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to create booking",
			},
		})
	}

	// Fetch the created booking with relations
	createdBooking, err := h.db.Booking.Query().
		Where(booking.IDEQ(newBooking.ID)).
		WithRide().
		Only(ctx)

	if err != nil {
		h.logger.Error("failed to fetch created booking", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Booking created but failed to fetch details",
			},
		})
	}

	response := h.transformToBookingResponse(createdBooking)
	return c.Status(fiber.StatusCreated).JSON(response)
}

// RespondToBooking handles POST /bookings/:bookingId/respond
func (h *BookingHandler) RespondToBooking(c fiber.Ctx) error {
	bookingID := c.Params("bookingId")

	var req models.RespondToBookingRequest
	// Fiber v3: Use Bind().Body() instead of BodyParser
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_REQUEST",
				Message: "Invalid request body",
			},
		})
	}

	// Validate action
	if req.Action != "accept" && req.Action != "reject" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INVALID_ACTION",
				Message: "action must be 'accept' or 'reject'",
			},
		})
	}

	// Get user ID from context (set by auth middleware)
	userID := c.Locals("user_id").(string)

	ctx := context.Background()

	// Fetch booking with ride
	b, err := h.db.Booking.Query().
		Where(booking.IDEQ(bookingID)).
		WithRide(func(q *ent.RideQuery) {
			q.WithDriver()
		}).
		Only(ctx)

	if err != nil {
		if ent.IsNotFound(err) {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
				Error: models.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Booking not found",
				},
			})
		}
		h.logger.Error("failed to fetch booking", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch booking",
			},
		})
	}

	// Check if user is the driver of the ride
	if b.Edges.Ride.DriverID != userID {
		return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "FORBIDDEN",
				Message: "You are not authorized to respond to this booking",
			},
		})
	}

	// Check if booking is still pending
	if b.Status != "pending" {
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "ALREADY_RESPONDED",
				Message: "Booking has already been responded to",
			},
		})
	}

	// Update booking status
	newStatus := "confirmed"
	if req.Action == "reject" {
		newStatus = "rejected"
	}

	respondedAt := time.Now()
	updateBuilder := b.Update().
		SetStatus(newStatus).
		SetRespondedAt(respondedAt)

	if req.Message != "" {
		updateBuilder = updateBuilder.SetDriverResponseMessage(req.Message)
	}

	updatedBooking, err := updateBuilder.Save(ctx)
	if err != nil {
		h.logger.Error("failed to update booking", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to update booking",
			},
		})
	}

	// If accepted, update ride available seats
	if req.Action == "accept" {
		_, err := b.Edges.Ride.Update().
			SetAvailableSeats(b.Edges.Ride.AvailableSeats - b.PassengerCount).
			Save(ctx)
		if err != nil {
			h.logger.Error("failed to update ride seats", zap.Error(err))
		}
	}

	// Fetch updated booking with relations
	finalBooking, err := h.db.Booking.Query().
		Where(booking.IDEQ(updatedBooking.ID)).
		WithRide().
		Only(ctx)

	if err != nil {
		h.logger.Error("failed to fetch updated booking", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Booking updated but failed to fetch details",
			},
		})
	}

	response := h.transformToBookingResponse(finalBooking)
	return c.JSON(response)
}

// Helper function to transform booking entity to response model
func (h *BookingHandler) transformToBookingResponse(b *ent.Booking) models.BookingResponse {
	response := models.BookingResponse{
		BookingID:      b.ID,
		RideID:         b.RideID,
		Status:         b.Status,
		PassengerCount: b.PassengerCount,
		TotalPrice: models.Price{
			Amount:   b.TotalPriceAmount,
			Currency: b.TotalPriceCurrency,
		},
		CreatedAt: b.CreatedAt,
	}

	if b.RespondedAt != nil {
		response.RespondedAt = b.RespondedAt
	}

	if b.Edges.Ride != nil {
		response.RideDetails = models.RideSummary{
			RideID:        b.Edges.Ride.ID,
			DepartureTime: b.Edges.Ride.DepartureTime,
		}

		if b.Edges.Ride.ArrivalTime != nil {
			response.RideDetails.ArrivalTime = b.Edges.Ride.ArrivalTime
		}

		response.RideDetails.Origin.City = b.Edges.Ride.OriginCity
		response.RideDetails.Destination.City = b.Edges.Ride.DestinationCity
	}

	return response
}
