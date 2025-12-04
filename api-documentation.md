# Ride Sharing API Documentation

Version: 1.0.0

Base URL: `https://api.ridesharing.com/v1`

## Authentication

All API endpoints require authentication using Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## Endpoints

### Rides

#### Search for Rides

Search for available rides with various filters.

**Endpoint:** `GET /rides/search`

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| origin | string | Yes | Departure city/location | Manchester |
| destination | string | Yes | Arrival city/location | London |
| date | date | Yes | Travel date (YYYY-MM-DD) | 2025-11-02 |
| passengers | integer | No | Number of passengers (default: 1) | 1 |
| type | string | No | Ride type filter | carpool, bus, all |

**Response:**

```json
{
  "total_count": 121,
  "carpool_count": 3,
  "bus_count": 118,
  "rides": [
    {
      "ride_id": "ride_123456",
      "type": "carpool",
      "ride_type": "one_time",
      "recurrence": null,
      "departure_time": "2025-11-02T09:00:00Z",
      "arrival_time": "2025-11-02T10:00:00Z",
      "duration_minutes": 240,
      "origin": {
        "city": "Tangerang",
        "address": "Taman Elok",
        "location_point": "Shell pom bensin"
      },
      "destination": {
        "city": "London",
        "address": "2 St Mary's Terrace, UK",
        "location_point": "Sarinah"
      },
      "price": {
        "amount": 30000,
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

**Example for Recurring Ride:**

```json
{
  "ride_id": "ride_456789",
  "type": "carpool",
  "ride_type": "recurring",
  "recurrence": {
    "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "start_date": "2025-11-04",
    "end_date": "2025-12-31"
  },
  "departure_time": "2025-11-02T08:00:00Z",
  "arrival_time": "2025-11-02T10:00:00Z",
  "price": {
    "amount": 30000,
    "currency": "IDR"
  }
}
```

---

#### Get Ride Details

Get detailed information about a specific ride.

**Endpoint:** `GET /rides/{rideId}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| rideId | string | Yes | Unique ride identifier |

**Response:**

```json
{
  "ride_id": "ride_123456",
  "type": "carpool",
  "ride_type": "one_time",
  "recurrence": null,
  "departure_time": "2025-11-02T09:00:00Z",
  "arrival_time": "2025-11-02T10:00:00Z",
  "duration_minutes": 240,
  "origin": {
        "city": "Tangerang",
        "address": "Taman Elok",
        "location_point": "Shell pom bensin"
      },
      "destination": {
        "city": "London",
        "address": "2 St Mary's Terrace, UK",
        "location_point": "Sarinah"
      },
      "price": {
        "amount": 30000,
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
        "smoking_allowed": false
      },
  "available_seats": 2,
  "stops": [
    {
      "location": {
        "city": "Jakarta",
        "address": "2 St Mary's Terrace, UK",
        "location_point": "Dekat Pertamina"
      },
      "time": "2025-11-02T11:30:00Z",
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

**Error Responses:**

- `404 Not Found` - Ride does not exist

---

#### Publish a Ride

Create a new ride offering.

**Endpoint:** `POST /rides`

**Request Body:**

```json
{
  "ride_type": "one_time",
  "recurrence": null,
  "origin": {
    "city": "Tangerang",
        "address": "Taman Elok, no 83.",
        "location_point": "Dekat Pom Bensin"
  },
  "destination": {
    "city": "Jakarta",
        "address": "2 St Mary's Terrace, Sudirman park",
        "location_point": "Sudirman park"
  },
  "departure_time": "2025-11-05T09:00:00Z",
  "arrival_time": "2025-11-02T10:00:00Z",
  "available_seats": 3,
  "price_per_seat": {
    "amount": 30000,
    "currency": "IDR"
  },
  "vehicle": {
    "make": "SKODA",
    "model": "ENYAQ IV",
    "color": "Red"
  },
  "amenities": {
    "smoking_allowed": false
  },
  "description": "Comfortable ride with music. I prefer quiet passengers."
}
```

**Example for Recurring Ride:**

```json
{
  "ride_type": "recurring",
  "recurrence": {
    "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "start_date": "2025-11-04",
    "end_date": "2025-12-31"
  },
  "origin": {
    "city": "Tangerang",
        "address": "Taman Elok, no 83.",
        "location_point": "Dekat Pom Bensin"
  },
  "destination": {
    "city": "Tangerang",
        "address": "Taman Elok, no 83.",
        "location_point": "Dekat Pom Bensin"
  },
  "departure_time": "2025-11-04T08:00:00Z",
  "arrival_time": "2025-11-02T10:00:00Z",
  "available_seats": 2,
  "price_per_seat": {
    "amount": 30000,
    "currency": "IDR"
  }
}
```

**Response:**

Returns the created ride details (same structure as Get Ride Details).

**Status Codes:**

- `201 Created` - Ride successfully created
- `400 Bad Request` - Invalid request data

---

### Bookings

#### Create a Booking

Request to book a ride.

**Endpoint:** `POST /bookings`

**Request Body:**

```json
{
  "ride_id": "ride_123456",
  "passenger_count": 1,
  "message": "Can you pick me up near the train station?"
}
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| ride_id | string | ID of the ride to book |
| passenger_count | integer | Number of passengers (minimum: 1) |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| message | string | Message to driver (max 500 chars). Can include pickup/dropoff preferences |

**Response:**

```json
{
  "booking_id": "booking_987654",
  "ride_id": "ride_123456",
  "status": "pending",
  "passenger_count": 1,
  "total_price": {
    "amount": 30000,
    "currency": "IDR"
  },
  "created_at": "2025-11-01T14:30:00Z",
  "responded_at": null,
  "ride_details": {
    "ride_id": "ride_123456",
    "departure_time": "2025-11-02T09:00:00Z",
    "arrival_time": "2025-11-02T10:00:00Z",
    "origin": {
      "city": "Tangerang"
    },
    "destination": {
      "city": "Jakarta"
    }
  }
}
```

**Status Codes:**

- `201 Created` - Booking request created
- `400 Bad Request` - Invalid request
- `409 Conflict` - Ride is full or no longer available

---

#### Driver Responds to Booking

Driver accepts or rejects a booking request.

**Endpoint:** `POST /bookings/{bookingId}/respond`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bookingId | string | Yes | Booking identifier |

**Request Body:**

```json
{
  "action": "accept",
  "message": "See you at the meeting point!"
}
```

**Required Fields:**

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| action | string | Driver's decision | accept, reject |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| message | string | Optional message to passenger (max 500 chars) |

**Response:**

```json
{
  "booking_id": "booking_987654",
  "ride_id": "ride_123456",
  "status": "confirmed",
  "passenger_count": 1,
  "total_price": {
    "amount": 30000,
    "currency": "IDR"
  },
  "created_at": "2025-11-01T14:30:00Z",
  "responded_at": "2025-11-01T14:45:00Z",
  "ride_details": {
    "ride_id": "ride_123456",
    "departure_time": "2025-11-02T09:00:00Z",
    "arrival_time": "2025-11-02T10:00:00Z",
  }
}
```

**Status Codes:**

- `200 OK` - Response processed successfully
- `400 Bad Request` - Invalid request
- `403 Forbidden` - Not authorized to respond to this booking
- `404 Not Found` - Booking not found
- `409 Conflict` - Booking already responded to

---

### Users

#### Get User Profile

Retrieve user/driver profile information.

**Endpoint:** `GET /users/{userId}/profile`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User identifier |

**Response:**

```json
{
  "user_id": "user_789",
  "name": "Syed Mujtaba Hasan",
  "age": 54,
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
  "bio": "Hi. I am a professional in the NHS and I live in Glasgow. I travel all over the UK, mostly for volunteering and to visit family. I'm friendly and love making new friends.",
  "preferences": {
    "chattiness": "I'm chatty when I feel comfortable",
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

**Status Codes:**

- `200 OK` - Profile retrieved successfully
- `404 Not Found` - User not found

---

## Data Models

### Ride Types

**One-Time Ride:**
- A single ride on a specific date and time
- `ride_type`: `"one_time"`
- `recurrence`: `null`

**Recurring Ride:**
- A ride that repeats on specific days of the week
- `ride_type`: `"recurring"`
- `recurrence`: Object with days_of_week, start_date, end_date

### Booking Status

| Status | Description |
|--------|-------------|
| pending | Booking request awaiting driver response |
| confirmed | Driver accepted the booking |
| rejected | Driver rejected the booking |
| cancelled | Booking was cancelled by passenger or driver |
| completed | Ride has been completed |

### Experience Levels

- `beginner`
- `intermediate`
- `expert`

### Membership Types

- `professional` - Professional/verified member
- `non_professional` - Regular member

---

## Error Responses

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Not authorized to access resource |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Request conflicts with current state |
| 500 | Internal Server Error - Server error occurred |

---

## Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Authenticated requests:** 1000 requests per hour
- **Search endpoint:** 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1635789600
```