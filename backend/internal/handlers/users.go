package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/slowtyper/poolie/backend/ent"
	"github.com/slowtyper/poolie/backend/ent/user"
	"github.com/slowtyper/poolie/backend/internal/models"
	"go.uber.org/zap"
)

// UserHandler handles user-related HTTP requests
type UserHandler struct {
	db     *ent.Client
	logger *zap.Logger
}

// NewUserHandler creates a new UserHandler
func NewUserHandler(db *ent.Client, logger *zap.Logger) *UserHandler {
	return &UserHandler{
		db:     db,
		logger: logger,
	}
}

// GetUserProfile handles GET /users/:userId/profile
func (h *UserHandler) GetUserProfile(c fiber.Ctx) error {
	userID := c.Params("userId")

	ctx := context.Background()
	u, err := h.db.User.Query().
		Where(user.IDEQ(userID)).
		Only(ctx)

	if err != nil {
		if ent.IsNotFound(err) {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
				Error: models.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "User not found",
				},
			})
		}
		h.logger.Error("failed to get user profile", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: models.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to get user profile",
			},
		})
	}

	profile := h.transformToUserProfile(u)
	return c.JSON(profile)
}

// Helper function to transform user entity to profile response
func (h *UserHandler) transformToUserProfile(u *ent.User) models.UserProfile {
	profile := models.UserProfile{
		UserID:            u.ID,
		Name:              u.Name,
		ExperienceLevel:   u.ExperienceLevel,
		Rating:            u.Rating,
		RatingCount:       u.RatingCount,
		ProfilePictureURL: u.ProfilePictureURL,
		MembershipType:    u.MembershipType,
		Verification: models.UserVerification{
			IsVerified:     u.IsVerified,
			VerifiedID:     u.VerifiedID,
			ConfirmedEmail: u.ConfirmedEmail,
			ConfirmedPhone: u.ConfirmedPhone,
		},
		Stats: models.UserStats{
			PublishedRides: u.PublishedRides,
			CompletedRides: u.CompletedRides,
			NeverCancels:   u.NeverCancels,
		},
	}

	if u.Age != nil {
		profile.Age = *u.Age
	}

	if u.DrivingRating != nil {
		profile.DrivingRating = *u.DrivingRating
	}

	if u.Bio != nil {
		profile.Bio = *u.Bio
	}

	// Parse preferences from JSON
	if u.Preferences != nil {
		prefs := models.UserPreferences{}
		if chattiness, ok := u.Preferences["chattiness"].(string); ok {
			prefs.Chattiness = chattiness
		}
		if music, ok := u.Preferences["music"].(string); ok {
			prefs.Music = music
		}
		if smoking, ok := u.Preferences["smoking"].(bool); ok {
			prefs.Smoking = smoking
		}
		if pets, ok := u.Preferences["pets"].(bool); ok {
			prefs.Pets = pets
		}
		profile.Preferences = prefs
	}

	return profile
}
