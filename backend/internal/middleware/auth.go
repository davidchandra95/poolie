package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"
)

// AuthMiddleware validates JWT tokens
// For now, this is a placeholder implementation
// In production, you would validate actual JWT tokens
func AuthMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		// Get the Authorization header
		authHeader := c.Get("Authorization")

		// For development, we'll accept any Bearer token
		// In production, validate the JWT properly
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    "UNAUTHORIZED",
					"message": "Missing authorization header",
				},
			})
		}

		// Extract the token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    "UNAUTHORIZED",
					"message": "Invalid authorization header format",
				},
			})
		}

		// TODO: Validate JWT token and extract user ID
		// For now, set a mock user ID in the context
		c.Locals("user_id", "user_789")

		return c.Next()
	}
}

// OptionalAuth allows requests with or without authentication
func OptionalAuth() fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				// TODO: Validate JWT token and extract user ID
				c.Locals("user_id", "user_789")
			}
		}

		return c.Next()
	}
}
