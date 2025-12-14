#!/bin/bash

set -e

echo "🌱 Seeding database with sample data..."

export DATABASE_URL="host=localhost port=5432 user=postgres password=postgres dbname=poolie sslmode=disable"

# Check if goose is installed
if ! command -v goose &> /dev/null; then
    echo "❌ goose not found. Please install it first:"
    echo "   go install github.com/pressly/goose/v3/cmd/goose@latest"
    exit 1
fi

# Run seed migration
goose -dir migrations postgres "$DATABASE_URL" up

echo "✅ Database seeded successfully!"
echo ""
echo "Sample data:"
echo "  - 3 users (user_789, user_456, user_123)"
echo "  - 3 vehicles"
echo "  - 3 rides"
echo "  - 2 bookings"
echo ""
echo "You can now test the API endpoints!"
