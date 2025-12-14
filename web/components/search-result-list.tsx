"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Ride, SearchRidesResponse } from "@/lib/types";
import { RideCard } from "@/components/ride-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SearchResultListProps {
    results: SearchRidesResponse | null;
    isLoading: boolean;
    error: string | null;
}

export function SearchResultList({ results, isLoading, error }: SearchResultListProps) {
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
                <p className="font-semibold">Error loading results</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex justify-between mb-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <div className="text-right space-y-2">
                                <Skeleton className="h-8 w-24 ml-auto" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-32 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!results) {
        return null;
    }

    if (results.rides.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No rides found
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    We couldn't find any rides matching your criteria. Try changing your dates or location.
                </p>
            </div>
        );
    }

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTypeFilter = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === "all") {
            params.delete("type");
        } else {
            params.set("type", type);
        }
        router.push(`/search?${params.toString()}`);
    };

    const currentType = searchParams.get("type") || "all";
    const amenitiesFilter = searchParams.get("amenities")?.split(",") || [];
    const sortBy = (searchParams.get("sortBy") as "price_asc" | "time_asc") || "time_asc";
    const isVerifiedFilter = searchParams.get("verified") === "true";

    if (!results) {
        return null;
    }

    const filteredAndSortedRides = results.rides
        .filter((ride) => {
            // Amenities filter
            if (amenitiesFilter.length > 0) {
                const hasAllAmenities = amenitiesFilter.every((amenity) => {
                    if (amenity === "ac") return ride.amenities.air_conditioner;
                    if (amenity === "smoking") return ride.amenities.smoking_allowed;
                    // if (amenity === "instant") return ride.ride_type === "instant"; 
                    return true;
                });
                if (!hasAllAmenities) return false;
            }

            // Verified user filter
            if (isVerifiedFilter && !ride.driver.is_verified) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            if (sortBy === "price_asc") {
                return a.price.amount - b.price.amount;
            }
            if (sortBy === "time_asc") {
                return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
            }
            return 0;
        });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl mx-auto w-full">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {filteredAndSortedRides.length} {filteredAndSortedRides.length === 1 ? "ride" : "rides"} available
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <button
                            onClick={() => handleTypeFilter("carpool")}
                            className={cn(
                                "hover:text-black transition-colors",
                                currentType === "carpool" && "font-black text-black underline decoration-2 underline-offset-4"
                            )}
                        >
                            {results.carpool_count} carpools
                        </button>
                        <button
                            onClick={() => handleTypeFilter("bus")}
                            className={cn(
                                "hover:text-black transition-colors",
                                currentType === "bus" && "font-black text-black underline decoration-2 underline-offset-4"
                            )}
                        >
                            {results.bus_count} buses
                        </button>
                        {currentType !== "all" && (
                            <button
                                onClick={() => handleTypeFilter("all")}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                </div>


            </div>

            <div className="space-y-4">
                {filteredAndSortedRides.map((ride) => (
                    <RideCard key={ride.ride_id} ride={ride} />
                ))}
            </div>
        </div>
    );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}
