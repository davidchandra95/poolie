"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", value);
        router.push(`/search?${params.toString()}`);
    };

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentAmenities = params.get("amenities")?.split(",") || [];

        if (checked) {
            if (!currentAmenities.includes(amenity)) {
                currentAmenities.push(amenity);
            }
        } else {
            const index = currentAmenities.indexOf(amenity);
            if (index > -1) {
                currentAmenities.splice(index, 1);
            }
        }

        if (currentAmenities.length > 0) {
            params.set("amenities", currentAmenities.join(","));
        } else {
            params.delete("amenities");
        }

        router.push(`/search?${params.toString()}`);
    };

    const handleVerifiedChange = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set("verified", "true");
        } else {
            params.delete("verified");
        }
        router.push(`/search?${params.toString()}`);
    };

    const currentAmenities = searchParams.get("amenities")?.split(",") || [];
    const currentSort = searchParams.get("sortBy") || "time_asc";
    const isVerified = searchParams.get("verified") === "true";

    return (
        <div className="space-y-6">
            {/* Sort By Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto">
                <h3 className="font-bold text-lg mb-4">Sort by</h3>
                <RadioGroup value={currentSort} onValueChange={handleSortChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="time_asc" id="time_asc" />
                        <Label htmlFor="time_asc" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Earliest Departure
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price_asc" id="price_asc" />
                        <Label htmlFor="price_asc" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Lowest Price
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto">
                <h3 className="font-bold text-lg mb-4">Amenities</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ac"
                            checked={currentAmenities.includes("ac")}
                            onCheckedChange={(checked: boolean) => handleAmenityChange("ac", checked)}
                        />
                        <Label htmlFor="ac" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Air Conditioning
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="smoking"
                            checked={currentAmenities.includes("smoking")}
                            onCheckedChange={(checked: boolean) => handleAmenityChange("smoking", checked)}
                        />
                        <Label htmlFor="smoking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Smoking Allowed
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="instant"
                            checked={currentAmenities.includes("instant")}
                            onCheckedChange={(checked: boolean) => handleAmenityChange("instant", checked)}
                        />
                        <Label htmlFor="instant" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Instant Booking
                        </Label>
                    </div>
                </div>
            </div>

            {/* Trust and Safety Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto">
                <h3 className="font-bold text-lg mb-4">Trust and Safety</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="verified"
                            checked={isVerified}
                            onCheckedChange={(checked: boolean) => handleVerifiedChange(checked)}
                        />
                        <Label htmlFor="verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Verified User
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
}
