# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Poolie is a rideshare/carpool web application built for the Indonesian market. It allows users to search for rides, view ride details, and book seats with drivers. The app uses mock data by default but can connect to a real API.

## Key Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding shadcn/ui Components
```bash
npx shadcn@latest add <component-name> -y
```

## Architecture

### API Client Pattern
The app uses a centralized API client (`lib/api.ts`) with automatic mock/real API switching:
- Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local` to use mock data (default)
- All API methods check `useMockData` flag and route to mock functions or real API
- Mock data is in `lib/mock-data.ts` with simulated network delays

### Search Parameters Structure
The search form uses a split location model:
- `originCity` / `destinationCity`: Dropdown selection (e.g., "Jakarta", "Bandung")
- `originLocation` / `destinationLocation`: Free text for specific addresses
- This dual-field approach allows filtering by city while supporting specific pickup/dropoff points

### Form Handling
Forms use React Hook Form + Zod validation:
- Form schemas defined with `z.object()` and custom refinements for complex validation
- All forms use shadcn/ui Form components for consistent styling
- Date picker uses Popover (not Dialog) and auto-closes on selection

### UI Component Customization
When working with shadcn/ui components:
- **Select component** (`components/ui/select.tsx`): Modified to use `w-full` instead of `w-fit` to ensure dropdowns fill their container
- All form inputs should have consistent height (currently `h-12`)
- Use `space-y-0` on FormItem to prevent unwanted spacing

### Indonesian Localization
- Main heading: "Nebeng kemana aja, hemat bareng"
- Navigation: "Nebeng" (Ride), "Nyetir" (Drive)
- Search button: "Cari tumpangan"
- Cities: Jakarta, Bandung, Surabaya, Yogyakarta, Semarang, Medan

## File Structure Notes

### Key Files
- `lib/types.ts`: All TypeScript interfaces for API data structures
- `lib/api.ts`: APIClient class with mock/real API switching
- `lib/mock-data.ts`: Mock data for development/testing
- `lib/format.ts`: Date, time, price, and duration formatting utilities
- `components/search-form.tsx`: Main search form with dual city/location fields
- `app/page.tsx`: Home page with hero section and search results
- `app/rides/[rideId]/page.tsx`: Dynamic ride details page

### Public Assets
- Images stored in `public/` are accessible at root path (e.g., `/car-sharing-service.jpg`)
- Use Next.js `Image` component with `fill` prop for hero images

## Important Patterns

### Search Flow
1. User fills search form (optional city + location for origin/destination)
2. Form validates that at least one origin OR destination field has a value
3. On submit, transforms form values to API parameters (city → `origin_city`, location → `origin_location`)
4. API client routes to mock or real API based on env variable
5. Results displayed as cards with ride details

### Mock Data Filtering
Mock data functions in `lib/mock-data.ts` filter rides by:
- City: Exact match (case-insensitive)
- Location: Partial match on address field (case-insensitive)
- Type: carpool/bus filter
- Passengers: Available seats >= requested passengers

### Component State Management
- Search results managed in parent page component state
- Date picker uses controlled state (`datePickerOpen`) to handle auto-close
- Forms use React Hook Form's controlled components throughout

## Styling Conventions

- Tailwind CSS with shadcn/ui components
- Gray-100 backgrounds for form sections with white inputs
- Black buttons with hover:bg-gray-800
- Consistent spacing: `gap-3` for grids, `space-y-1` between form sections
- Icons from lucide-react (CalendarIcon, UserIcon, etc.)
