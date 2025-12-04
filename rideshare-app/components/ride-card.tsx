import Link from "next/link";
import { Ride } from "@/lib/types";
import { formatDate, formatTime, formatPrice, formatDuration, formatRecurrenceDays } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Snowflake, CigaretteOff, Car, CheckCircle2, Bus } from "lucide-react";

interface RideCardProps {
  ride: Ride;
}

export function RideCard({ ride }: RideCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/rides/${ride.ride_id}`} className="block max-w-2xl mx-auto group">
      <Card className="hover:shadow-[0_8px_30px_rgb(253,164,175,0.3)] transition-all duration-300 border-0 shadow-sm overflow-hidden py-0 gap-0">
        <CardContent className="p-0">
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {ride.type === "carpool" ? <Car className="w-9 h-9 text-gray-900" /> : <Bus className="w-9 h-9 text-gray-900" />}
                  {ride.ride_type === "recurring" && (
                    <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Recurring
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 truncate group-hover:text-gray-700 transition-colors">
                  {ride.origin.city} → {ride.destination.city}
                </h3>
                <p className="text-sm text-gray-500 truncate max-w-[280px]">
                  {ride.origin.address} to {ride.destination.address}
                </p>
                {ride.ride_type === "recurring" && ride.recurrence && (
                  <div className="text-xs text-gray-400 mt-1 font-medium">
                    {formatRecurrenceDays(ride.recurrence.days_of_week)}
                  </div>
                )}
              </div>
              <div className="text-right ml-3 shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">{formatPrice(ride.price)}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">per seat</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 mb-4 bg-gray-50 rounded-xl px-4 border border-gray-100">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Departure</div>
                <div className="font-bold text-base text-gray-900">{formatTime(ride.departure_time)}</div>
                <div className="text-[10px] font-medium text-gray-500">
                  {formatDate(ride.departure_time)}
                </div>
              </div>

              {ride.duration_minutes && (
                <div className="text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Duration</div>
                  <div className="font-bold text-base text-gray-900">{formatDuration(ride.duration_minutes)}</div>
                </div>
              )}

              {ride.arrival_time && (
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Arrival</div>
                  <div className="font-bold text-base text-gray-900">{formatTime(ride.arrival_time)}</div>
                  <div className="text-[10px] font-medium text-gray-500">
                    {formatDate(ride.arrival_time)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                  <AvatarImage src={ride.driver.profile_picture_url} alt={ride.driver.name} />
                  <AvatarFallback className="text-xs font-bold">{getInitials(ride.driver.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm text-gray-900 flex items-center gap-1">
                    {ride.driver.name}
                    {ride.driver.is_verified && (
                      <CheckCircle2 className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current text-black" />
                    {ride.driver.rating.toFixed(1)} <span className="text-gray-300">|</span> {ride.driver.rating_count} reviews
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Seats</div>
                <div className="font-bold text-sm text-gray-900">{ride.available_seats} left</div>
              </div>
            </div>
          </div>

          {(ride.amenities.air_conditioner !== undefined || ride.amenities.smoking_allowed !== undefined || ride.vehicle) && (
            <div className="flex gap-2 px-3 sm:px-4 pb-3 sm:pb-4 flex-wrap">
              {ride.amenities.air_conditioner && (
                <span className="text-xs font-medium bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                  <Snowflake className="w-3.5 h-3.5" /> AC
                </span>
              )}
              {!ride.amenities.smoking_allowed && (
                <span className="text-xs font-medium bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                  <CigaretteOff className="w-3.5 h-3.5" /> No smoke
                </span>
              )}
              {ride.vehicle && (
                <span className="text-xs font-medium bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                  <Car className="w-3.5 h-3.5" /> {ride.vehicle.make}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
