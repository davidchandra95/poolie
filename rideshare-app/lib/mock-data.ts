import { SearchRidesResponse, Ride, Booking, UserProfile } from "./types";

export const mockRides: Ride[] = [
  {
    ride_id: "ride_123456",
    type: "carpool",
    ride_type: "one_time",
    recurrence: null,
    departure_time: "2025-11-25T09:00:00Z",
    arrival_time: "2025-11-25T13:00:00Z",
    duration_minutes: 240,
    origin: {
      city: "Manchester",
      address: "Oxford Road Station",
      location_point: "Station entrance",
    },
    destination: {
      city: "London",
      address: "King's Cross Station",
      location_point: "Main entrance",
    },
    price: {
      amount: 25,
      currency: "GBP",
    },
    driver: {
      user_id: "user_789",
      name: "Sarah Johnson",
      rating: 4.8,
      rating_count: 42,
      profile_picture_url: "https://i.pravatar.cc/150?img=1",
      is_verified: true,
    },
    amenities: {
      smoking_allowed: false,
      air_conditioner: true,
    },
    available_seats: 3,
    vehicle: {
      make: "Toyota",
      model: "Prius",
      color: "Silver",
    },
    booking_policies: {
      instant_confirmation: true,
      cancellation_policy: "flexible",
    },
  },
  {
    ride_id: "ride_456789",
    type: "carpool",
    ride_type: "recurring",
    recurrence: {
      days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      start_date: "2025-11-24",
      end_date: "2025-12-31",
    },
    departure_time: "2025-11-25T08:00:00Z",
    arrival_time: "2025-11-25T12:30:00Z",
    duration_minutes: 270,
    origin: {
      city: "Manchester",
      address: "Piccadilly Gardens",
      location_point: "Bus stop A",
    },
    destination: {
      city: "London",
      address: "Victoria Station",
      location_point: "Coach station",
    },
    price: {
      amount: 20,
      currency: "GBP",
    },
    driver: {
      user_id: "user_234",
      name: "James Wilson",
      rating: 5.0,
      rating_count: 128,
      profile_picture_url: "https://i.pravatar.cc/150?img=12",
      is_verified: true,
    },
    amenities: {
      smoking_allowed: false,
      air_conditioner: true,
    },
    available_seats: 2,
    vehicle: {
      make: "Honda",
      model: "Civic",
      color: "Blue",
    },
    stops: [
      {
        location: {
          city: "Birmingham",
          address: "New Street Station",
          location_point: "Station forecourt",
        },
        time: "2025-11-25T10:00:00Z",
        type: "intermediate",
      },
    ],
    booking_policies: {
      instant_confirmation: false,
      cancellation_policy: "moderate",
    },
  },
  {
    ride_id: "ride_789012",
    type: "bus",
    ride_type: "one_time",
    recurrence: null,
    departure_time: "2025-11-25T10:30:00Z",
    arrival_time: "2025-11-25T15:00:00Z",
    duration_minutes: 270,
    origin: {
      city: "Manchester",
      address: "Shudehill Interchange",
      location_point: "Platform 3",
    },
    destination: {
      city: "London",
      address: "Victoria Coach Station",
      location_point: "Bay 12",
    },
    price: {
      amount: 15,
      currency: "GBP",
    },
    driver: {
      user_id: "user_567",
      name: "National Express",
      rating: 4.5,
      rating_count: 1502,
      profile_picture_url: "https://i.pravatar.cc/150?img=5",
      is_verified: true,
    },
    amenities: {
      smoking_allowed: false,
      air_conditioner: true,
    },
    available_seats: 45,
    booking_policies: {
      instant_confirmation: true,
      cancellation_policy: "strict",
    },
  },
  {
    ride_id: "ride_345678",
    type: "carpool",
    ride_type: "one_time",
    recurrence: null,
    departure_time: "2025-11-25T14:00:00Z",
    arrival_time: "2025-11-25T18:30:00Z",
    duration_minutes: 270,
    origin: {
      city: "Manchester",
      address: "Trafford Centre",
      location_point: "Car park entrance",
    },
    destination: {
      city: "London",
      address: "Heathrow Airport",
      location_point: "Terminal 5",
    },
    price: {
      amount: 35,
      currency: "GBP",
    },
    driver: {
      user_id: "user_890",
      name: "Emma Thompson",
      rating: 4.9,
      rating_count: 67,
      profile_picture_url: "https://i.pravatar.cc/150?img=9",
      is_verified: true,
    },
    amenities: {
      smoking_allowed: false,
      air_conditioner: true,
    },
    available_seats: 2,
    vehicle: {
      make: "BMW",
      model: "3 Series",
      color: "Black",
    },
    booking_policies: {
      instant_confirmation: true,
      cancellation_policy: "never_cancels",
    },
  },
  {
    ride_id: "ride_901234",
    type: "carpool",
    ride_type: "one_time",
    recurrence: null,
    departure_time: "2025-11-25T15:00:00Z",
    arrival_time: "2025-11-25T19:30:00Z",
    duration_minutes: 270,
    origin: {
      city: "London",
      address: "King's Cross Station",
      location_point: "Main entrance",
    },
    destination: {
      city: "Manchester",
      address: "Piccadilly Station",
      location_point: "Station forecourt",
    },
    price: {
      amount: 22,
      currency: "GBP",
    },
    driver: {
      user_id: "user_456",
      name: "Michael Chen",
      rating: 4.7,
      rating_count: 35,
      profile_picture_url: "https://i.pravatar.cc/150?img=13",
      is_verified: true,
    },
    amenities: {
      smoking_allowed: false,
      air_conditioner: true,
    },
    available_seats: 2,
    vehicle: {
      make: "Volkswagen",
      model: "Golf",
      color: "White",
    },
    booking_policies: {
      instant_confirmation: true,
      cancellation_policy: "moderate",
    },
  },
  {
    ride_id: "ride_567890",
    type: "carpool",
    ride_type: "one_time",
    recurrence: null,
    departure_time: "2025-11-25T11:00:00Z",
    arrival_time: "2025-11-25T13:30:00Z",
    duration_minutes: 150,
    origin: {
      city: "Birmingham",
      address: "New Street Station",
      location_point: "Station entrance",
    },
    destination: {
      city: "London",
      address: "Euston Station",
      location_point: "Main entrance",
    },
    price: {
      amount: 18,
      currency: "GBP",
    },
    driver: {
      user_id: "user_678",
      name: "Lisa Anderson",
      rating: 4.9,
      rating_count: 58,
      profile_picture_url: "https://i.pravatar.cc/150?img=10",
      is_verified: true,
    },
    amenities: {
      smoking_allowed: false,
      air_conditioner: true,
    },
    available_seats: 3,
    vehicle: {
      make: "Ford",
      model: "Focus",
      color: "Grey",
    },
    booking_policies: {
      instant_confirmation: false,
      cancellation_policy: "flexible",
    },
  },
];

export const mockUserProfile: UserProfile = {
  user_id: "user_789",
  name: "Sarah Johnson",
  age: 32,
  experience_level: "intermediate",
  rating: 4.8,
  rating_count: 42,
  driving_rating: "3/3 – Excellent driving skills",
  profile_picture_url: "https://i.pravatar.cc/150?img=1",
  verification: {
    is_verified: true,
    verified_id: true,
    confirmed_email: true,
    confirmed_phone: true,
  },
  bio: "I'm a freelance consultant who regularly travels between Manchester and London. I enjoy meeting new people and sharing travel costs. Always punctual and professional.",
  preferences: {
    chattiness: "I'm chatty when I feel comfortable",
    music: "Pop and indie music",
    smoking: false,
    pets: false,
  },
  membership_type: "non_professional",
  stats: {
    published_rides: 23,
    completed_rides: 21,
    never_cancels: true,
  },
};

export function getMockSearchResults(params: {
  originCity?: string;
  originLocation?: string;
  destinationCity?: string;
  destinationLocation?: string;
  date: string;
  passengers?: number;
  type?: string;
}): SearchRidesResponse {
  // Always return all rides regardless of search params
  const filteredRides = [...mockRides];

  const carpoolCount = filteredRides.filter(
    (ride) => ride.type === "carpool"
  ).length;
  const busCount = filteredRides.filter((ride) => ride.type === "bus").length;

  return {
    total_count: filteredRides.length,
    carpool_count: carpoolCount,
    bus_count: busCount,
    rides: filteredRides,
  };
}

export function getMockRideDetails(rideId: string): Ride | null {
  return mockRides.find((ride) => ride.ride_id === rideId) || null;
}

export function createMockBooking(data: {
  ride_id: string;
  passenger_count: number;
  message?: string;
}): Booking {
  const ride = mockRides.find((r) => r.ride_id === data.ride_id);

  if (!ride) {
    throw new Error("Ride not found");
  }

  return {
    booking_id: `booking_${Math.random().toString(36).substr(2, 9)}`,
    ride_id: data.ride_id,
    status: "pending",
    passenger_count: data.passenger_count,
    total_price: {
      amount: ride.price.amount * data.passenger_count,
      currency: ride.price.currency,
    },
    created_at: new Date().toISOString(),
    responded_at: null,
    ride_details: {
      ride_id: ride.ride_id,
      departure_time: ride.departure_time,
      origin: {
        city: ride.origin.city,
      },
      destination: {
        city: ride.destination.city,
      },
    },
  };
}
