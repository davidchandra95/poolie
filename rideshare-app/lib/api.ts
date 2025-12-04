import {
  SearchRidesResponse,
  SearchParams,
  Ride,
  CreateBookingRequest,
  Booking,
  UserProfile
} from "./types";
import {
  getMockSearchResults,
  getMockRideDetails,
  createMockBooking,
  mockUserProfile,
} from "./mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.ridesharing.com/v1";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export class APIClient {
  private token: string | null = null;
  private useMockData: boolean = USE_MOCK_DATA;

  setToken(token: string) {
    this.token = token;
  }

  setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "An error occurred");
    }

    return response.json();
  }

  async searchRides(params: SearchParams): Promise<SearchRidesResponse> {
    if (this.useMockData) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getMockSearchResults(params);
    }

    const queryParams = new URLSearchParams({
      date: params.date,
      ...(params.originCity && { origin_city: params.originCity }),
      ...(params.originLocation && { origin_location: params.originLocation }),
      ...(params.destinationCity && { destination_city: params.destinationCity }),
      ...(params.destinationLocation && { destination_location: params.destinationLocation }),
      ...(params.passengers && { passengers: params.passengers.toString() }),
      ...(params.type && { type: params.type }),
    });

    return this.request<SearchRidesResponse>(
      `/rides/search?${queryParams.toString()}`
    );
  }

  async getRideDetails(rideId: string): Promise<Ride> {
    if (this.useMockData) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const ride = getMockRideDetails(rideId);
      if (!ride) {
        throw new Error("Ride not found");
      }
      return ride;
    }

    return this.request<Ride>(`/rides/${rideId}`);
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    if (this.useMockData) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return createMockBooking(data);
    }

    return this.request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    if (this.useMockData) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockUserProfile;
    }

    return this.request<UserProfile>(`/users/${userId}/profile`);
  }
}

export const apiClient = new APIClient();
