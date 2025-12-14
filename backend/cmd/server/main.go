package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/slowtyper/poolie/backend/internal/config"
	"github.com/slowtyper/poolie/backend/internal/db"
	"github.com/slowtyper/poolie/backend/internal/handlers"
	"github.com/slowtyper/poolie/backend/internal/logger"
	"github.com/slowtyper/poolie/backend/internal/middleware"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	log, err := logger.New(cfg.Server.Environment)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	defer log.Sync()

	log.Info("starting Poolie API server",
		zap.String("environment", cfg.Server.Environment),
		zap.String("port", cfg.Server.Port),
	)

	// Initialize database
	dbClient, err := db.New(&cfg.Database, log)
	if err != nil {
		log.Fatal("failed to connect to database", zap.Error(err))
	}
	defer db.Close(dbClient, log)

	// NOTE: Using Goose for migrations instead of Ent auto-migrations
	// Run Goose migrations separately with: make migrate-up
	// or: goose -dir migrations postgres "$DATABASE_URL" up
	//
	// Ent auto-migrations are disabled to avoid conflicts with Goose
	// ctx := context.Background()
	// if err := db.RunMigrations(ctx, dbClient, log); err != nil {
	// 	log.Fatal("failed to run database migrations", zap.Error(err))
	// }

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: errorHandler(log),
		ReadTimeout:  time.Duration(cfg.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(cfg.Server.WriteTimeout) * time.Second,
		AppName:      "Poolie API v1.0.0",
	})

	// Global middleware
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
	}))
	app.Use(middleware.Logger(log))

	// Initialize handlers
	rideHandler := handlers.NewRideHandler(dbClient, log)
	bookingHandler := handlers.NewBookingHandler(dbClient, log)
	userHandler := handlers.NewUserHandler(dbClient, log)

	// API routes
	api := app.Group("/v1")

	// Health check endpoint (no auth required)
	api.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":    "ok",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Rides endpoints
	rides := api.Group("/rides")
	rides.Get("/search", rideHandler.SearchRides)
	rides.Get("/:rideId", rideHandler.GetRide)
	rides.Post("", middleware.AuthMiddleware(), rideHandler.CreateRide)

	// Bookings endpoints
	bookings := api.Group("/bookings", middleware.AuthMiddleware())
	bookings.Post("", bookingHandler.CreateBooking)
	bookings.Post("/:bookingId/respond", bookingHandler.RespondToBooking)

	// Users endpoints
	users := api.Group("/users")
	users.Get("/:userId/profile", userHandler.GetUserProfile)

	// Start server
	addr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)

	// Graceful shutdown
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
		<-sigint

		log.Info("shutting down server gracefully...")

		if err := app.Shutdown(); err != nil {
			log.Error("server shutdown error", zap.Error(err))
		}
	}()

	log.Info("server is listening", zap.String("address", addr))
	if err := app.Listen(addr); err != nil {
		log.Fatal("failed to start server", zap.Error(err))
	}

	log.Info("server stopped")
}

// errorHandler handles errors globally
func errorHandler(log *zap.Logger) fiber.ErrorHandler {
	return func(c fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError
		message := "Internal Server Error"

		if e, ok := err.(*fiber.Error); ok {
			code = e.Code
			message = e.Message
		}

		log.Error("request error",
			zap.String("path", c.Path()),
			zap.Int("status", code),
			zap.Error(err),
		)

		return c.Status(code).JSON(fiber.Map{
			"error": fiber.Map{
				"code":    "ERROR",
				"message": message,
			},
		})
	}
}
