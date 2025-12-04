"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchModification } from "@/components/search-modification";
import { SearchResultList } from "@/components/search-result-list";
import { SearchFilters } from "@/components/search-filters";
import { apiClient } from "@/lib/api";
import { SearchRidesResponse, SearchParams } from "@/lib/types";

function SearchPageContent() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<SearchRidesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Extract params for initial form state
    const currentParams: Partial<SearchParams> = {
        originCity: searchParams.get("originCity") || undefined,
        originLocation: searchParams.get("originLocation") || undefined,
        destinationCity: searchParams.get("destinationCity") || undefined,
        destinationLocation: searchParams.get("destinationLocation") || undefined,
        date: searchParams.get("date") || undefined,
        passengers: searchParams.get("passengers") ? parseInt(searchParams.get("passengers")!) : undefined,
        type: searchParams.get("type") || undefined,
    };

    useEffect(() => {
        async function fetchResults() {
            setIsLoading(true);
            setError(null);

            try {
                const params: SearchParams = {
                    originCity: searchParams.get("originCity") || undefined,
                    originLocation: searchParams.get("originLocation") || undefined,
                    destinationCity: searchParams.get("destinationCity") || undefined,
                    destinationLocation: searchParams.get("destinationLocation") || undefined,
                    date: searchParams.get("date") || new Date().toISOString().split('T')[0],
                    passengers: searchParams.get("passengers") ? parseInt(searchParams.get("passengers")!) : undefined,
                    type: searchParams.get("type") || undefined,
                };

                const data = await apiClient.searchRides(params);
                setResults(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch results");
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50">
            <SearchModification defaultValues={currentParams} />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6 justify-center">
                    {/* Sidebar Filter Section */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-24">
                            <SearchFilters />
                        </div>
                    </aside>

                    {/* Main Results Section */}
                    <div className="w-full lg:flex-1 max-w-2xl">
                        <SearchResultList
                            results={results}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <SearchPageContent />
        </Suspense>
    );
}
