package db

import (
	"context"
	"fmt"

	"github.com/slowtyper/poolie/backend/ent"
	"github.com/slowtyper/poolie/backend/internal/config"
	"go.uber.org/zap"

	_ "github.com/lib/pq"
)

// New creates a new database client
func New(cfg *config.DatabaseConfig, logger *zap.Logger) (*ent.Client, error) {
	client, err := ent.Open("postgres", cfg.GetDSN())
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Note: Ent doesn't expose DB() method directly in newer versions
	// The connection is verified during Open()

	logger.Info("database connection established",
		zap.String("host", cfg.Host),
		zap.String("database", cfg.DBName),
	)

	return client, nil
}

// Close closes the database connection
func Close(client *ent.Client, logger *zap.Logger) {
	if err := client.Close(); err != nil {
		logger.Error("failed to close database connection", zap.Error(err))
	} else {
		logger.Info("database connection closed")
	}
}

// RunMigrations runs the Ent auto-migrations
func RunMigrations(ctx context.Context, client *ent.Client, logger *zap.Logger) error {
	logger.Info("running database migrations")

	if err := client.Schema.Create(ctx); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	logger.Info("database migrations completed successfully")
	return nil
}
