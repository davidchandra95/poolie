# RideShare Web Application

A modern ride-sharing web application built with Next.js, TypeScript, and shadcn/ui. This application allows users to search for available rides, view detailed ride information, and book seats with drivers.

## Features

- Search for rides with filters (origin, destination, date, passengers, type)
- View detailed ride information including driver details, vehicle info, and amenities
- Book rides with customizable passenger count and messages to drivers
- Responsive design with a clean, modern UI using shadcn/ui components
- TypeScript for type safety
- Full integration with the Ride Sharing API

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod (validation)
- date-fns (date formatting)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. The application is pre-configured to use mock data. A `.env.local` file has been created with:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.ridesharing.com/v1
NEXT_PUBLIC_USE_MOCK_DATA=true
```

To use the real API instead, set `NEXT_PUBLIC_USE_MOCK_DATA=false` in your `.env.local` file.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
web/
├── app/                          # Next.js app directory
│   ├── rides/[rideId]/          # Dynamic ride details page
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (search)
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── booking-form.tsx         # Booking form component
│   ├── ride-card.tsx            # Ride card component
│   └── search-form.tsx          # Search form component
├── lib/                         # Utility functions and API client
│   ├── api.ts                   # API client
│   ├── format.ts                # Formatting utilities
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## API Integration

The application integrates with the Ride Sharing API with the following endpoints:

- `GET /rides/search` - Search for available rides
- `GET /rides/{rideId}` - Get ride details
- `POST /bookings` - Create a booking

### Mock Data

The application comes with mock data enabled by default, allowing you to test all features without a backend API. The mock data includes:

- 4 sample rides (3 carpools, 1 bus) from Manchester to London
- Realistic driver profiles with ratings and verification
- Vehicle information and amenities
- Simulated network delays to mimic real API calls

To toggle between mock and real API:

```bash
# Use mock data (default)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Use real API
NEXT_PUBLIC_USE_MOCK_DATA=false
```

Mock data is defined in `lib/mock-data.ts` and can be customized to fit your testing needs.

### Authentication

To use authenticated endpoints with the real API, you need to set your bearer token:

```typescript
import { apiClient } from "@/lib/api";

apiClient.setToken("your_bearer_token");
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Search Rides

The home page allows users to search for rides with the following filters:
- Origin city
- Destination city
- Travel date
- Number of passengers
- Ride type (all, carpool, bus)

### Ride Details & Booking

The ride details page displays:
- Complete ride information (origin, destination, times, duration)
- Driver profile with rating and verification status
- Vehicle information
- Amenities and booking policies
- Intermediate stops (if any)
- Booking form with passenger count and optional message

## License

This project was created for demonstration purposes.
