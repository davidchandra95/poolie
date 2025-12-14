-- +goose Up
-- +goose StatementBegin

-- Insert sample users
INSERT INTO users (id, name, email, password_hash, age, experience_level, rating, rating_count, driving_rating, profile_picture_url, is_verified, verified_id, confirmed_email, confirmed_phone, bio, preferences, membership_type, published_rides, completed_rides, never_cancels) VALUES
('user_789', 'Budi Hasan', 'budi.hasan@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 32, 'intermediate', 5.0, 2, '3/3 – Good driving skills', 'https://example.com/profiles/user_789.jpg', true, true, true, true, 'Hi. I am a professional driver and I live in Jakarta. I travel all over Indonesia for work. I am friendly and love making new friends.', '{"chattiness": "I am chatty when I feel comfortable", "music": "Silence is golden", "smoking": false, "pets": false}', 'non_professional', 1, 1, true),
('user_456', 'Siti Rahman', 'siti.rahman@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 28, 'beginner', 4.5, 5, '2/3 – Average driving skills', 'https://example.com/profiles/user_456.jpg', true, true, true, false, 'Love driving and meeting new people!', '{"chattiness": "I love to talk", "music": "I enjoy pop music", "smoking": false, "pets": true}', 'non_professional', 5, 3, true),
('user_123', 'Ahmad Wijaya', 'ahmad.wijaya@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 45, 'expert', 4.8, 120, '3/3 – Excellent driving skills', 'https://example.com/profiles/user_123.jpg', true, true, true, true, 'Professional driver with 15 years of experience. Safe and reliable.', '{"chattiness": "Prefer quiet rides", "music": "Classical music", "smoking": false, "pets": false}', 'professional', 150, 140, true);

-- Insert sample vehicles
INSERT INTO vehicles (id, user_id, make, model, color, license_plate, year) VALUES
('vehicle_001', 'user_789', 'SKODA', 'ENYAQ IV', 'Red', 'B 1234 XYZ', 2023),
('vehicle_002', 'user_456', 'Toyota', 'Avanza', 'Silver', 'B 5678 ABC', 2022),
('vehicle_003', 'user_123', 'Honda', 'CR-V', 'Black', 'B 9012 DEF', 2024);

-- Insert sample rides
INSERT INTO rides (id, driver_id, vehicle_id, type, ride_type, recurrence, departure_time, arrival_time, duration_minutes, origin_city, origin_address, origin_location_point, destination_city, destination_address, destination_location_point, price_amount, price_currency, available_seats, total_seats, amenities, stops, instant_confirmation, cancellation_policy, description, status) VALUES
('ride_123456', 'user_789', 'vehicle_001', 'carpool', 'one_time', null, '2025-12-15 09:00:00', '2025-12-15 13:00:00', 240, 'Jakarta', 'Jl. Sudirman No. 123', 'Near Grand Indonesia', 'Bandung', 'Jl. Asia Afrika No. 8', 'Near Gedung Sate', 150000, 'IDR', 2, 3, '{"smoking_allowed": false, "air_conditioner": true}', '[{"location": {"city": "Bekasi", "address": "Jl. Ahmad Yani", "location_point": "Rest Area KM 20"}, "time": "2025-12-15T10:30:00Z", "type": "intermediate"}]', true, 'never_cancels', 'Comfortable ride with AC. No smoking please.', 'active'),
('ride_789012', 'user_456', 'vehicle_002', 'carpool', 'one_time', null, '2025-12-16 07:00:00', '2025-12-16 11:00:00', 240, 'Tangerang', 'Jl. Gading Serpong', 'BSD City', 'Bogor', 'Jl. Pajajaran No. 45', 'Botani Square', 100000, 'IDR', 3, 4, '{"smoking_allowed": false, "air_conditioner": true}', '[]', true, 'never_cancels', 'Family-friendly ride, pets welcome!', 'active'),
('ride_345678', 'user_123', 'vehicle_003', 'carpool', 'recurring', '{"days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday"], "start_date": "2025-12-10", "end_date": "2026-01-31"}', '2025-12-17 06:30:00', '2025-12-17 08:00:00', 90, 'Depok', 'Jl. Margonda Raya', 'UI Campus', 'Jakarta', 'Jl. Thamrin No. 1', 'Bundaran HI', 50000, 'IDR', 2, 3, '{"smoking_allowed": false, "air_conditioner": true}', '[]', true, 'never_cancels', 'Daily commute to central Jakarta. Professional driver.', 'active');

-- Insert sample bookings
INSERT INTO bookings (id, ride_id, passenger_id, status, passenger_count, total_price_amount, total_price_currency, message, driver_response_message, responded_at) VALUES
('booking_001', 'ride_123456', 'user_456', 'confirmed', 1, 150000, 'IDR', 'Hi! Can you pick me up at the Grand Indonesia entrance?', 'Sure, no problem! See you there.', '2025-12-10 10:30:00'),
('booking_002', 'ride_789012', 'user_789', 'pending', 2, 200000, 'IDR', 'Is it okay if I bring my small dog?', null, null);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM bookings WHERE id IN ('booking_001', 'booking_002');
DELETE FROM rides WHERE id IN ('ride_123456', 'ride_789012', 'ride_345678');
DELETE FROM vehicles WHERE id IN ('vehicle_001', 'vehicle_002', 'vehicle_003');
DELETE FROM users WHERE id IN ('user_789', 'user_456', 'user_123');
-- +goose StatementEnd
