export interface Location {
  city: string;
  address: string;
  location_point: string;
}

export interface Price {
  amount: number;
  currency: string;
}

export interface Driver {
  user_id: string;
  name: string;
  rating: number;
  rating_count: number;
  profile_picture_url: string;
  is_verified: boolean;
}

export interface Amenities {
  smoking_allowed: boolean;
  air_conditioner?: boolean;
}

export interface Recurrence {
  days_of_week: string[];
  start_date: string;
  end_date: string;
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
}

export interface Stop {
  location: Location;
  time: string;
  type: string;
}

export interface BookingPolicies {
  instant_confirmation: boolean;
  cancellation_policy: string;
}

export interface Ride {
  ride_id: string;
  type: string;
  ride_type: "one_time" | "recurring";
  recurrence: Recurrence | null;
  departure_time: string;
  arrival_time?: string;
  duration_minutes?: number;
  origin: Location;
  destination: Location;
  price: Price;
  driver: Driver;
  amenities: Amenities;
  available_seats: number;
  stops?: Stop[];
  vehicle?: Vehicle;
  booking_policies?: BookingPolicies;
}

export interface SearchRidesResponse {
  total_count: number;
  carpool_count: number;
  bus_count: number;
  rides: Ride[];
}

export interface SearchParams {
  originCity?: string;
  originLocation?: string;
  destinationCity?: string;
  destinationLocation?: string;
  date: string;
  passengers?: number;
  type?: string;
}

export interface CreateBookingRequest {
  ride_id: string;
  passenger_count: number;
  message?: string;
}

export interface BookingRideDetails {
  ride_id: string;
  departure_time: string;
  origin: {
    city: string;
  };
  destination: {
    city: string;
  };
}

export interface Booking {
  booking_id: string;
  ride_id: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";
  passenger_count: number;
  total_price: Price;
  created_at: string;
  responded_at: string | null;
  ride_details: BookingRideDetails;
}

export interface UserVerification {
  is_verified: boolean;
  verified_id: boolean;
  confirmed_email: boolean;
  confirmed_phone: boolean;
}

export interface UserPreferences {
  chattiness: string;
  music: string;
  smoking: boolean;
  pets: boolean;
}

export interface UserStats {
  published_rides: number;
  completed_rides: number;
  never_cancels: boolean;
}

export interface UserProfile {
  user_id: string;
  name: string;
  age: number;
  experience_level: "beginner" | "intermediate" | "expert";
  rating: number;
  rating_count: number;
  driving_rating: string;
  profile_picture_url: string;
  verification: UserVerification;
  bio: string;
  preferences: UserPreferences;
  membership_type: "professional" | "non_professional";
  stats: UserStats;
}

export interface APIError {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
}
