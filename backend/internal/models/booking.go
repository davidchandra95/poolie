package models

import "time"

// CreateBookingRequest represents a request to create a booking
type CreateBookingRequest struct {
	RideID         string `json:"ride_id"`
	PassengerCount int    `json:"passenger_count"`
	Message        string `json:"message,omitempty"`
}

// BookingResponse represents a booking response
type BookingResponse struct {
	BookingID      string       `json:"booking_id"`
	RideID         string       `json:"ride_id"`
	Status         string       `json:"status"`
	PassengerCount int          `json:"passenger_count"`
	TotalPrice     Price        `json:"total_price"`
	CreatedAt      time.Time    `json:"created_at"`
	RespondedAt    *time.Time   `json:"responded_at,omitempty"`
	RideDetails    RideSummary  `json:"ride_details"`
}

// RideSummary represents a summary of ride information in booking
type RideSummary struct {
	RideID        string    `json:"ride_id"`
	DepartureTime time.Time `json:"departure_time"`
	ArrivalTime   *time.Time `json:"arrival_time,omitempty"`
	Origin        struct {
		City string `json:"city"`
	} `json:"origin"`
	Destination   struct {
		City string `json:"city"`
	} `json:"destination"`
}

// RespondToBookingRequest represents a driver's response to a booking
type RespondToBookingRequest struct {
	Action  string `json:"action"`
	Message string `json:"message,omitempty"`
}
