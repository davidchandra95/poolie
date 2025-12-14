# API Testing Guide

This guide provides example requests for testing the Poolie API endpoints.

## Setup

1. Start the server:
```bash
make run
# or
go run cmd/server/main.go
```

2. The server will be available at `http://localhost:8080`

## Health Check

```bash
curl http://localhost:8080/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T12:00:00Z"
}
```

## Rides Endpoints

### 1. Search for Rides

**Without authentication:**

```bash
curl "http://localhost:8080/v1/rides/search?origin=Jakarta&destination=Bandung&date=2025-12-15"
```

**With filters:**

```bash
# Search with passenger count
curl "http://localhost:8080/v1/rides/search?origin=Jakarta&destination=Bandung&date=2025-12-15&passengers=2"

# Filter by type (carpool, bus, or all)
curl "http://localhost:8080/v1/rides/search?origin=Jakarta&destination=Bandung&date=2025-12-15&type=carpool"
```

Expected response:
```json
{
  "total_count": 1,
  "carpool_count": 1,
  "bus_count": 0,
  "rides": [
    {
      "ride_id": "ride_123456",
      "type": "carpool",
      "ride_type": "one_time",
      "recurrence": null,
      "departure_time": "2025-12-15T09:00:00Z",
      "arrival_time": "2025-12-15T13:00:00Z",
      "duration_minutes": 240,
      "origin": {
        "city": "Jakarta",
        "address": "Jl. Sudirman No. 123",
        "location_point": "Near Grand Indonesia"
      },
      "destination": {
        "city": "Bandung",
        "address": "Jl. Asia Afrika No. 8",
        "location_point": "Near Gedung Sate"
      },
      "price": {
        "amount": 150000,
        "currency": "IDR"
      },
      "driver": {
        "user_id": "user_789",
        "name": "Budi Hasan",
        "rating": 5.0,
        "rating_count": 2,
        "profile_picture_url": "https://example.com/profiles/user_789.jpg",
        "is_verified": true
      },
      "amenities": {
        "smoking_allowed": false,
        "air_conditioner": true
      },
      "available_seats": 2
    }
  ]
}
```

### 2. Get Ride Details

```bash
curl http://localhost:8080/v1/rides/ride_123456
```

Expected response:
```json
{
  "ride_id": "ride_123456",
  "type": "carpool",
  "ride_type": "one_time",
  "recurrence": null,
  "departure_time": "2025-12-15T09:00:00Z",
  "arrival_time": "2025-12-15T13:00:00Z",
  "duration_minutes": 240,
  "origin": {
    "city": "Jakarta",
    "address": "Jl. Sudirman No. 123",
    "location_point": "Near Grand Indonesia"
  },
  "destination": {
    "city": "Bandung",
    "address": "Jl. Asia Afrika No. 8",
    "location_point": "Near Gedung Sate"
  },
  "price": {
    "amount": 150000,
    "currency": "IDR"
  },
  "driver": {
    "user_id": "user_789",
    "name": "Budi Hasan",
    "rating": 5.0,
    "rating_count": 2,
    "profile_picture_url": "https://example.com/profiles/user_789.jpg",
    "is_verified": true
  },
  "amenities": {
    "smoking_allowed": false,
    "air_conditioner": true
  },
  "available_seats": 2,
  "stops": [
    {
      "location": {
        "city": "Bekasi",
        "address": "Jl. Ahmad Yani",
        "location_point": "Rest Area KM 20"
      },
      "time": "2025-12-15T10:30:00Z",
      "type": "intermediate"
    }
  ],
  "vehicle": {
    "make": "SKODA",
    "model": "ENYAQ IV",
    "color": "Red"
  },
  "booking_policies": {
    "instant_confirmation": true,
    "cancellation_policy": "never_cancels"
  }
}
```

### 3. Create a Ride

**Requires authentication**

```bash
curl -X POST http://localhost:8080/v1/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "ride_type": "one_time",
    "origin": {
      "city": "Surabaya",
      "address": "Jl. Pemuda No. 1",
      "location_point": "Near Tunjungan Plaza"
    },
    "destination": {
      "city": "Malang",
      "address": "Jl. Ijen No. 10",
      "location_point": "Near Alun-Alun"
    },
    "departure_time": "2025-12-20T08:00:00Z",
    "arrival_time": "2025-12-20T11:00:00Z",
    "available_seats": 3,
    "price_per_seat": {
      "amount": 100000,
      "currency": "IDR"
    },
    "vehicle": {
      "make": "Toyota",
      "model": "Innova",
      "color": "White"
    },
    "amenities": {
      "smoking_allowed": false,
      "air_conditioner": true
    },
    "description": "Comfortable ride to Malang"
  }'
```

**Create Recurring Ride:**

```bash
curl -X POST http://localhost:8080/v1/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "ride_type": "recurring",
    "recurrence": {
      "days_of_week": ["monday", "wednesday", "friday"],
      "start_date": "2025-12-10",
      "end_date": "2026-01-31"
    },
    "origin": {
      "city": "Jakarta",
      "address": "Jl. Gatot Subroto"
    },
    "destination": {
      "city": "Tangerang",
      "address": "BSD City"
    },
    "departure_time": "2025-12-10T07:00:00Z",
    "arrival_time": "2025-12-10T08:30:00Z",
    "available_seats": 2,
    "price_per_seat": {
      "amount": 50000,
      "currency": "IDR"
    },
    "vehicle": {
      "make": "Honda",
      "model": "Civic",
      "color": "Blue"
    }
  }'
```

## Bookings Endpoints

### 1. Create a Booking

**Requires authentication**

```bash
curl -X POST http://localhost:8080/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "ride_id": "ride_123456",
    "passenger_count": 2,
    "message": "Hi! Can you pick me up at the main entrance?"
  }'
```

Expected response:
```json
{
  "booking_id": "booking_abc123",
  "ride_id": "ride_123456",
  "status": "pending",
  "passenger_count": 2,
  "total_price": {
    "amount": 300000,
    "currency": "IDR"
  },
  "created_at": "2025-12-07T10:00:00Z",
  "responded_at": null,
  "ride_details": {
    "ride_id": "ride_123456",
    "departure_time": "2025-12-15T09:00:00Z",
    "arrival_time": "2025-12-15T13:00:00Z",
    "origin": {
      "city": "Jakarta"
    },
    "destination": {
      "city": "Bandung"
    }
  }
}
```

### 2. Respond to Booking (Driver)

**Requires authentication (driver only)**

**Accept booking:**

```bash
curl -X POST http://localhost:8080/v1/bookings/booking_001/respond \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "action": "accept",
    "message": "Great! See you at 9 AM sharp."
  }'
```

**Reject booking:**

```bash
curl -X POST http://localhost:8080/v1/bookings/booking_002/respond \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '{
    "action": "reject",
    "message": "Sorry, the ride is already full."
  }'
```

Expected response (accepted):
```json
{
  "booking_id": "booking_001",
  "ride_id": "ride_123456",
  "status": "confirmed",
  "passenger_count": 1,
  "total_price": {
    "amount": 150000,
    "currency": "IDR"
  },
  "created_at": "2025-12-10T10:30:00Z",
  "responded_at": "2025-12-10T11:00:00Z",
  "ride_details": {
    "ride_id": "ride_123456",
    "departure_time": "2025-12-15T09:00:00Z",
    "arrival_time": "2025-12-15T13:00:00Z"
  }
}
```

## Users Endpoints

### 1. Get User Profile

```bash
curl http://localhost:8080/v1/users/user_789/profile
```

Expected response:
```json
{
  "user_id": "user_789",
  "name": "Budi Hasan",
  "age": 32,
  "experience_level": "intermediate",
  "rating": 5.0,
  "rating_count": 2,
  "driving_rating": "3/3 – Good driving skills",
  "profile_picture_url": "https://example.com/profiles/user_789.jpg",
  "verification": {
    "is_verified": true,
    "verified_id": true,
    "confirmed_email": true,
    "confirmed_phone": true
  },
  "bio": "Hi. I am a professional driver and I live in Jakarta.",
  "preferences": {
    "chattiness": "I am chatty when I feel comfortable",
    "music": "Silence is golden",
    "smoking": false,
    "pets": false
  },
  "membership_type": "non_professional",
  "stats": {
    "published_rides": 1,
    "completed_rides": 1,
    "never_cancels": true
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `400 Bad Request` - Invalid request data
  ```json
  {
    "error": {
      "code": "INVALID_REQUEST",
      "message": "Invalid request body"
    }
  }
  ```

- `401 Unauthorized` - Missing or invalid authentication
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Missing authorization header"
    }
  }
  ```

- `404 Not Found` - Resource not found
  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "Ride not found"
    }
  }
  ```

- `409 Conflict` - Request conflicts with current state
  ```json
  {
    "error": {
      "code": "INSUFFICIENT_SEATS",
      "message": "Not enough available seats"
    }
  }
  ```

## Testing with Postman

You can import these examples into Postman:

1. Create a new collection named "Poolie API"
2. Set a collection variable: `base_url` = `http://localhost:8080/v1`
3. Set an environment variable: `auth_token` = `test-token-123`
4. Add the above requests to the collection

## Authentication Note

The current implementation uses a placeholder auth middleware. For testing:
- Any `Authorization: Bearer <token>` header will work
- The user ID is hardcoded to `user_789`
- In production, implement proper JWT validation and user extraction
