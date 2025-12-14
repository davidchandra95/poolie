#!/bin/bash

set -e

echo "🚀 Setting up Poolie Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Install Go dependencies
echo "📦 Installing Go dependencies..."
go mod download

# Start PostgreSQL with Docker Compose
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
export DATABASE_URL="host=localhost port=5432 user=postgres password=postgres dbname=poolie sslmode=disable"

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo "📥 Installing goose..."
    go install github.com/pressly/goose/v3/cmd/goose@latest
fi

goose -dir migrations postgres "$DATABASE_URL" up

echo "✅ Setup complete!"
echo ""
echo "To run the server:"
echo "  make run"
echo ""
echo "Or:"
echo "  go run cmd/server/main.go"
echo ""
echo "API will be available at: http://localhost:8080"
echo "Health check: http://localhost:8080/v1/health"
