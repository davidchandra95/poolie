package models

// UserProfile represents a user's profile information
type UserProfile struct {
	UserID            string             `json:"user_id"`
	Name              string             `json:"name"`
	Age               int                `json:"age,omitempty"`
	ExperienceLevel   string             `json:"experience_level"`
	Rating            float64            `json:"rating"`
	RatingCount       int                `json:"rating_count"`
	DrivingRating     string             `json:"driving_rating,omitempty"`
	ProfilePictureURL string             `json:"profile_picture_url,omitempty"`
	Verification      UserVerification   `json:"verification"`
	Bio               string             `json:"bio,omitempty"`
	Preferences       UserPreferences    `json:"preferences"`
	MembershipType    string             `json:"membership_type"`
	Stats             UserStats          `json:"stats"`
}

// UserVerification represents user verification status
type UserVerification struct {
	IsVerified     bool `json:"is_verified"`
	VerifiedID     bool `json:"verified_id"`
	ConfirmedEmail bool `json:"confirmed_email"`
	ConfirmedPhone bool `json:"confirmed_phone"`
}

// UserPreferences represents user preferences
type UserPreferences struct {
	Chattiness string `json:"chattiness,omitempty"`
	Music      string `json:"music,omitempty"`
	Smoking    bool   `json:"smoking"`
	Pets       bool   `json:"pets"`
}

// UserStats represents user statistics
type UserStats struct {
	PublishedRides  int  `json:"published_rides"`
	CompletedRides  int  `json:"completed_rides"`
	NeverCancels    bool `json:"never_cancels"`
}
