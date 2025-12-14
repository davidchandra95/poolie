# Poolie Backend API

A rideshare/carpool application backend built with Go, designed for the Indonesian market.

## Tech Stack

- **Web Framework**: [Fiber v2](https://github.com/gofiber/fiber) - Fast, Express-inspired HTTP framework
- **ORM**: [Ent](https://entgo.io/) - Entity framework for database operations
- **Logging**: [Zap](https://github.com/uber-go/zap) - Structured, leveled logging
- **Migrations**: [Goose](https://github.com/pressly/goose) - Database migration tool
- **Configuration**: [Viper](https://github.com/spf13/viper) - Configuration management
- **Database**: PostgreSQL

## Features

- **Rides Management**: Create, search, and view ride details
- **Booking System**: Book rides and manage booking requests
- **User Profiles**: View driver and passenger profiles
- **Authentication**: JWT-based authentication middleware
- **Structured Logging**: Request/response logging with Zap
- **CORS Support**: Cross-origin resource sharing enabled
- **Graceful Shutdown**: Proper cleanup on server termination

## Project Structure

```
backend/
├── cmd/
│   └── server/          # Main application entry point
│       └── main.go
├── ent/
│   └── schema/          # Ent entity schemas
│       ├── user.go
│       ├── vehicle.go
│       ├── ride.go
│       └── booking.go
├── internal/
│   ├── config/          # Configuration management
│   ├── db/              # Database client initialization
│   ├── handlers/        # HTTP request handlers
│   │   ├── rides.go
│   │   ├── bookings.go
│   │   └── users.go
│   ├── middleware/      # HTTP middlewares
│   │   ├── auth.go
│   │   └── logger.go
│   ├── models/          # Request/response models
│   │   ├── ride.go
│   │   ├── booking.go
│   │   ├── user.go
│   │   └── responses.go
│   └── logger/          # Logger configuration
├── migrations/          # Database migration files
│   └── 00001_initial_schema.sql
├── go.mod
└── go.sum
```

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 14 or higher
- Make (optional, for convenience commands)

## Getting Started

### 1. Clone the Repository

```bash
cd /Users/slowtyper/code/go/poolie/backend
```

### 2. Install Dependencies

```bash
go mod download
```

### 3. Setup PostgreSQL Database

Create a PostgreSQL database:

```bash
createdb poolie
```

Or using psql:

```sql
CREATE DATABASE poolie;
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:

```env
POOLIE_DATABASE_HOST=localhost
POOLIE_DATABASE_PORT=5432
POOLIE_DATABASE_USER=postgres
POOLIE_DATABASE_PASSWORD=postgres
POOLIE_DATABASE_DBNAME=poolie
POOLIE_DATABASE_SSLMODE=disable

POOLIE_SERVER_PORT=8080
POOLIE_SERVER_HOST=0.0.0.0
POOLIE_SERVER_ENVIRONMENT=development

POOLIE_JWT_SECRET=your-secret-key-change-in-production
```

### 5. Run Database Migrations

Using Goose:

```bash
goose -dir migrations postgres "host=localhost port=5432 user=postgres password=postgres dbname=poolie sslmode=disable" up
```

Or let the application run auto-migrations (Ent migrations run on startup).

### 6. Run the Server

```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080` (or your configured port).

## API Endpoints

### Health Check

```
GET /v1/health
```

No authentication required.

### Rides

```
GET    /v1/rides/search              # Search for rides
GET    /v1/rides/:rideId             # Get ride details
POST   /v1/rides                     # Create a new ride (requires auth)
```

**Search Example:**
```bash
curl "http://localhost:8080/v1/rides/search?origin=Jakarta&destination=Bandung&date=2025-12-10"
```

### Bookings

```
POST   /v1/bookings                  # Create a booking (requires auth)
POST   /v1/bookings/:bookingId/respond # Respond to booking (requires auth)
```

**Create Booking Example:**
```bash
curl -X POST http://localhost:8080/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ride_id": "ride_12345678",
    "passenger_count": 2,
    "message": "Can you pick me up near the train station?"
  }'
```

### Users

```
GET    /v1/users/:userId/profile     # Get user profile
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

**Note**: The current implementation uses a placeholder auth middleware. In production, you should implement proper JWT token validation.

## Development

### Generate Ent Code

After modifying Ent schemas:

```bash
go generate ./ent
```

Or:

```bash
go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema
```

### Create New Migration

```bash
goose -dir migrations create migration_name sql
```

### Run Tests

```bash
go test ./...
```

### Build for Production

```bash
go build -o poolie-server cmd/server/main.go
```

Run the binary:

```bash
./poolie-server
```

## Configuration

The application can be configured via:

1. **Environment variables** (prefixed with `POOLIE_`)
2. **Config file** (`config.yaml` in the root or `./config` directory)

Environment variables take precedence over config files.

### Available Configuration Options

#### Server
- `POOLIE_SERVER_PORT` (default: `8080`)
- `POOLIE_SERVER_HOST` (default: `0.0.0.0`)
- `POOLIE_SERVER_ENVIRONMENT` (default: `development`)
- `POOLIE_SERVER_READTIMEOUT` (default: `10` seconds)
- `POOLIE_SERVER_WRITETIMEOUT` (default: `10` seconds)

#### Database
- `POOLIE_DATABASE_HOST` (default: `localhost`)
- `POOLIE_DATABASE_PORT` (default: `5432`)
- `POOLIE_DATABASE_USER` (default: `postgres`)
- `POOLIE_DATABASE_PASSWORD` (default: `postgres`)
- `POOLIE_DATABASE_DBNAME` (default: `poolie`)
- `POOLIE_DATABASE_SSLMODE` (default: `disable`)

#### JWT
- `POOLIE_JWT_SECRET` (default: `your-secret-key-change-in-production`)
- `POOLIE_JWT_EXPIRATION` (default: `86400` seconds / 24 hours)

## Logging

The application uses Zap for structured logging:

- **Development**: Pretty-printed, colored console output
- **Production**: JSON-formatted logs with timestamps

Logs include:
- HTTP request/response details
- Database operations
- Error traces with stack traces for error-level logs

## Error Handling

All errors follow a consistent JSON format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Production Deployment

### Environment Variables

Set the following for production:

```bash
export POOLIE_SERVER_ENVIRONMENT=production
export POOLIE_JWT_SECRET=<strong-random-secret>
export POOLIE_DATABASE_SSLMODE=require
```

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o poolie-server cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/poolie-server .
EXPOSE 8080
CMD ["./poolie-server"]
```

Build and run:

```bash
docker build -t poolie-backend .
docker run -p 8080:8080 --env-file .env poolie-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
