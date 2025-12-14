# Poolie Backend - Quick Start Guide

Get the Poolie backend up and running in 5 minutes!

## Prerequisites

- Go 1.21+ installed
- Docker and Docker Compose (for PostgreSQL)
- Git

## Option 1: Automated Setup (Recommended)

```bash
# Navigate to backend directory
cd /Users/slowtyper/code/go/poolie/backend

# Run setup script (creates .env, starts DB, runs migrations)
./scripts/setup.sh

# Run the server
make run
```

Server will be available at: **http://localhost:8080**

## Option 2: Manual Setup

### Step 1: Install Dependencies

```bash
cd /Users/slowtyper/code/go/poolie/backend
go mod download
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env if needed (defaults are fine for local development)
```

### Step 3: Start PostgreSQL

```bash
docker-compose up -d
```

Wait a few seconds for PostgreSQL to start.

### Step 4: Run Migrations

```bash
# Install goose if not already installed
go install github.com/pressly/goose/v3/cmd/goose@latest

# Run migrations
export DATABASE_URL="host=localhost port=5432 user=postgres password=postgres dbname=poolie sslmode=disable"
goose -dir migrations postgres "$DATABASE_URL" up
```

### Step 5: Start the Server

```bash
go run cmd/server/main.go
```

## Verify Installation

### 1. Health Check

```bash
curl http://localhost:8080/v1/health
```

Expected output:
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T12:00:00Z"
}
```

### 2. Search for Rides

```bash
curl "http://localhost:8080/v1/rides/search?origin=Jakarta&destination=Bandung&date=2025-12-15"
```

You should see a JSON response with ride listings.

### 3. Get User Profile

```bash
curl http://localhost:8080/v1/users/user_789/profile
```

You should see Budi Hasan's profile.

## Sample Data

The migrations include sample data:

**Users:**
- `user_789` - Budi Hasan (driver)
- `user_456` - Siti Rahman (driver)
- `user_123` - Ahmad Wijaya (professional driver)

**Rides:**
- `ride_123456` - Jakarta to Bandung (Dec 15)
- `ride_789012` - Tangerang to Bogor (Dec 16)
- `ride_345678` - Depok to Jakarta (recurring)

**Bookings:**
- `booking_001` - Confirmed booking
- `booking_002` - Pending booking

## API Endpoints

### Public (No Auth)
- `GET /v1/health` - Health check
- `GET /v1/rides/search` - Search rides
- `GET /v1/rides/:rideId` - Get ride details
- `GET /v1/users/:userId/profile` - Get user profile

### Protected (Requires Auth)
- `POST /v1/rides` - Create a ride
- `POST /v1/bookings` - Create a booking
- `POST /v1/bookings/:bookingId/respond` - Respond to booking

### Authentication

For protected endpoints, include this header:
```
Authorization: Bearer test-token-123
```

Note: Current implementation uses placeholder auth. Any bearer token will work.

## Example API Calls

### Create a Booking

```bash
curl -X POST http://localhost:8080/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "ride_id": "ride_123456",
    "passenger_count": 2,
    "message": "Can you pick me up at Grand Indonesia?"
  }'
```

### Create a Ride

```bash
curl -X POST http://localhost:8080/v1/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "ride_type": "one_time",
    "origin": {
      "city": "Surabaya",
      "address": "Jl. Pemuda No. 1"
    },
    "destination": {
      "city": "Malang",
      "address": "Jl. Ijen No. 10"
    },
    "departure_time": "2025-12-20T08:00:00Z",
    "available_seats": 3,
    "price_per_seat": {
      "amount": 100000,
      "currency": "IDR"
    },
    "vehicle": {
      "make": "Toyota",
      "model": "Innova",
      "color": "White"
    }
  }'
```

## Development Commands

```bash
# Run the server
make run

# Build binary
make build

# Run tests
make test

# Format code
make fmt

# Run migrations
make migrate-up

# View all commands
make help
```

## Project Structure

```
backend/
├── cmd/server/main.go          # Application entry
├── ent/schema/                 # Database entities
├── internal/
│   ├── handlers/               # HTTP handlers
│   ├── middleware/             # Middleware
│   ├── models/                 # Request/response models
│   ├── config/                 # Configuration
│   ├── db/                     # Database setup
│   └── logger/                 # Logging setup
├── migrations/                 # Database migrations
└── scripts/                    # Utility scripts
```

## Troubleshooting

### Port 8080 already in use

Change the port in `.env`:
```bash
POOLIE_SERVER_PORT=3000
```

### Database connection failed

Ensure PostgreSQL is running:
```bash
docker-compose ps
```

If not running:
```bash
docker-compose up -d postgres
```

### Migrations failed

Reset the database:
```bash
docker-compose down -v
docker-compose up -d
./scripts/setup.sh
```

## Next Steps

1. **Read the full documentation:**
   - `README.md` - Complete setup guide
   - `API_TESTING.md` - Detailed API examples
   - `IMPLEMENTATION_SUMMARY.md` - Architecture overview

2. **Test the API:**
   - Use Postman, curl, or your frontend
   - Try all endpoints
   - Test error cases

3. **Customize:**
   - Update configuration in `.env`
   - Modify handlers in `internal/handlers/`
   - Add new endpoints as needed

## Support

- Check logs for errors
- Review documentation
- Inspect database with: `docker-compose exec postgres psql -U postgres -d poolie`

## Production Deployment

See `IMPLEMENTATION_SUMMARY.md` for production checklist and deployment guide.

---

**You're ready to go! 🚀**

The Poolie backend is now running and ready for development.
