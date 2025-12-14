package models

import "time"

// SearchRidesRequest represents a ride search request
type SearchRidesRequest struct {
	Origin      string `query:"origin"`
	Destination string `query:"destination"`
	Date        string `query:"date"`
	Passengers  int    `query:"passengers"`
	Type        string `query:"type"`
}

// SearchRidesResponse represents the response for ride search
type SearchRidesResponse struct {
	TotalCount    int           `json:"total_count"`
	CarpoolCount  int           `json:"carpool_count"`
	BusCount      int           `json:"bus_count"`
	Rides         []RidePreview `json:"rides"`
}

// RidePreview represents a ride in search results
type RidePreview struct {
	RideID          string         `json:"ride_id"`
	Type            string         `json:"type"`
	RideType        string         `json:"ride_type"`
	Recurrence      *Recurrence    `json:"recurrence,omitempty"`
	DepartureTime   time.Time      `json:"departure_time"`
	ArrivalTime     *time.Time     `json:"arrival_time,omitempty"`
	DurationMinutes *int           `json:"duration_minutes,omitempty"`
	Origin          Location       `json:"origin"`
	Destination     Location       `json:"destination"`
	Price           Price          `json:"price"`
	Driver          Driver         `json:"driver"`
	Amenities       Amenities      `json:"amenities"`
	AvailableSeats  int            `json:"available_seats"`
}

// RideDetail represents detailed ride information
type RideDetail struct {
	RideID          string          `json:"ride_id"`
	Type            string          `json:"type"`
	RideType        string          `json:"ride_type"`
	Recurrence      *Recurrence     `json:"recurrence,omitempty"`
	DepartureTime   time.Time       `json:"departure_time"`
	ArrivalTime     *time.Time      `json:"arrival_time,omitempty"`
	DurationMinutes *int            `json:"duration_minutes,omitempty"`
	Origin          Location        `json:"origin"`
	Destination     Location        `json:"destination"`
	Price           Price           `json:"price"`
	Driver          Driver          `json:"driver"`
	Amenities       Amenities       `json:"amenities"`
	AvailableSeats  int             `json:"available_seats"`
	Stops           []Stop          `json:"stops,omitempty"`
	Vehicle         Vehicle         `json:"vehicle"`
	BookingPolicies BookingPolicies `json:"booking_policies"`
}

// CreateRideRequest represents a request to create a new ride
type CreateRideRequest struct {
	RideType      string                 `json:"ride_type"`
	Recurrence    *Recurrence            `json:"recurrence,omitempty"`
	Origin        Location               `json:"origin"`
	Destination   Location               `json:"destination"`
	DepartureTime time.Time              `json:"departure_time"`
	ArrivalTime   *time.Time             `json:"arrival_time,omitempty"`
	AvailableSeats int                   `json:"available_seats"`
	PricePerSeat  Price                  `json:"price_per_seat"`
	Vehicle       Vehicle                `json:"vehicle"`
	Amenities     map[string]interface{} `json:"amenities,omitempty"`
	Description   string                 `json:"description,omitempty"`
}
