-- +goose Up
-- +goose StatementBegin
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    age INTEGER CHECK (age > 0),
    experience_level VARCHAR(50) DEFAULT 'beginner',
    rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    driving_rating VARCHAR(255),
    profile_picture_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_id BOOLEAN DEFAULT FALSE,
    confirmed_email BOOLEAN DEFAULT FALSE,
    confirmed_phone BOOLEAN DEFAULT FALSE,
    bio TEXT,
    preferences JSONB,
    membership_type VARCHAR(50) DEFAULT 'non_professional',
    published_rides INTEGER DEFAULT 0 CHECK (published_rides >= 0),
    completed_rides INTEGER DEFAULT 0 CHECK (completed_rides >= 0),
    never_cancels BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    license_plate VARCHAR(50),
    year INTEGER CHECK (year > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
    id VARCHAR(255) PRIMARY KEY,
    driver_id VARCHAR(255) NOT NULL,
    vehicle_id VARCHAR(255),
    type VARCHAR(50) DEFAULT 'carpool',
    ride_type VARCHAR(50) DEFAULT 'one_time',
    recurrence JSONB,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    origin_city VARCHAR(255) NOT NULL,
    origin_address TEXT NOT NULL,
    origin_location_point VARCHAR(255),
    destination_city VARCHAR(255) NOT NULL,
    destination_address TEXT NOT NULL,
    destination_location_point VARCHAR(255),
    price_amount BIGINT NOT NULL CHECK (price_amount > 0),
    price_currency VARCHAR(10) DEFAULT 'IDR',
    available_seats INTEGER NOT NULL CHECK (available_seats > 0),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    amenities JSONB,
    stops JSONB,
    instant_confirmation BOOLEAN DEFAULT TRUE,
    cancellation_policy VARCHAR(50) DEFAULT 'never_cancels',
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    passenger_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    passenger_count INTEGER NOT NULL CHECK (passenger_count > 0),
    total_price_amount BIGINT NOT NULL CHECK (total_price_amount > 0),
    total_price_currency VARCHAR(10) DEFAULT 'IDR',
    message TEXT,
    driver_response_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rides_search ON rides(origin_city, destination_city, departure_time);
CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_bookings_ride ON bookings(ride_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_user ON vehicles(user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_rides_updated_at ON rides;
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP INDEX IF EXISTS idx_vehicles_user;
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_passenger;
DROP INDEX IF EXISTS idx_bookings_ride;
DROP INDEX IF EXISTS idx_rides_status;
DROP INDEX IF EXISTS idx_rides_driver;
DROP INDEX IF EXISTS idx_rides_search;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
