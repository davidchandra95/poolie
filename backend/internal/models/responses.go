package models

import "time"

// ErrorResponse represents a standard error response
type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

// ErrorDetail contains error information
type ErrorDetail struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

// Location represents a location with city, address, and point
type Location struct {
	City          string `json:"city"`
	Address       string `json:"address"`
	LocationPoint string `json:"location_point,omitempty"`
}

// Price represents a price with amount and currency
type Price struct {
	Amount   int64  `json:"amount"`
	Currency string `json:"currency"`
}

// Driver represents driver information in ride responses
type Driver struct {
	UserID            string  `json:"user_id"`
	Name              string  `json:"name"`
	Rating            float64 `json:"rating"`
	RatingCount       int     `json:"rating_count"`
	ProfilePictureURL string  `json:"profile_picture_url,omitempty"`
	IsVerified        bool    `json:"is_verified"`
}

// Vehicle represents vehicle information
type Vehicle struct {
	Make  string `json:"make"`
	Model string `json:"model"`
	Color string `json:"color"`
}

// Amenities represents ride amenities
type Amenities struct {
	SmokingAllowed bool `json:"smoking_allowed"`
	AirConditioner bool `json:"air_conditioner,omitempty"`
}

// Recurrence represents recurring ride information
type Recurrence struct {
	DaysOfWeek []string `json:"days_of_week"`
	StartDate  string   `json:"start_date"`
	EndDate    string   `json:"end_date"`
}

// Stop represents an intermediate stop
type Stop struct {
	Location Location  `json:"location"`
	Time     time.Time `json:"time"`
	Type     string    `json:"type"`
}

// BookingPolicies represents ride booking policies
type BookingPolicies struct {
	InstantConfirmation bool   `json:"instant_confirmation"`
	CancellationPolicy  string `json:"cancellation_policy"`
}
