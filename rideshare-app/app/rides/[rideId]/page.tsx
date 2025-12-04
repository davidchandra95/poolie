"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Calendar, User, Car, Bus, CheckCircle2, Star } from "lucide-react";

import { apiClient } from "@/lib/api";
import { Ride, Booking, CreateBookingRequest } from "@/lib/types";
import { formatDate, formatTime, formatPrice, formatDuration, formatRecurrenceDays } from "@/lib/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/booking-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RideDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rideId = params.rideId as string;

  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    async function fetchRide() {
      try {
        const data = await apiClient.getRideDetails(rideId);
        setRide(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ride details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRide();
  }, [rideId]);

  async function handleBooking(data: CreateBookingRequest) {
    setIsBooking(true);
    try {
      const bookingResult = await apiClient.createBooking(data);
      setBooking(bookingResult);
      setShowSuccessDialog(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading ride details...</div>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error || "Ride not found"}</p>
          <Link href="/">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {ride.type === "carpool" ? <Car className="w-9 h-9 text-gray-900" /> : <Bus className="w-9 h-9 text-gray-900" />}
                    {ride.ride_type === "recurring" && (
                      <Badge variant="outline">Recurring</Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl">
                    {ride.origin.city} → {ride.destination.city}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Departure</span>
                      </div>
                      <div>
                        <div className="font-semibold">{ride.origin.city}</div>
                        <div className="text-sm text-muted-foreground">{ride.origin.address}</div>
                        <div className="text-sm text-muted-foreground">{ride.origin.location_point}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Destination</span>
                      </div>
                      <div>
                        <div className="font-semibold">{ride.destination.city}</div>
                        <div className="text-sm text-muted-foreground">{ride.destination.address}</div>
                        <div className="text-sm text-muted-foreground">{ride.destination.location_point}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        Date
                      </div>
                      <div className="font-medium">{formatDate(ride.departure_time)}</div>
                      {ride.ride_type === "recurring" && ride.recurrence && (
                        <div className="text-sm text-muted-foreground">
                          {formatRecurrenceDays(ride.recurrence.days_of_week)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Clock className="h-4 w-4" />
                        Departure Time
                      </div>
                      <div className="font-medium">{formatTime(ride.departure_time)}</div>
                    </div>

                    {ride.duration_minutes && (
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">Duration</div>
                        <div className="font-medium">{formatDuration(ride.duration_minutes)}</div>
                      </div>
                    )}
                  </div>

                  {ride.stops && ride.stops.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3">Stops</h3>
                        <div className="space-y-2">
                          {ride.stops.map((stop, index) => (
                            <div key={index} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                              <div>
                                <div className="font-medium">{stop.location.city}</div>
                                <div className="text-sm text-muted-foreground">{stop.location.location_point}</div>
                              </div>
                              <div className="text-sm text-muted-foreground">{formatTime(stop.time)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={ride.driver.profile_picture_url} alt={ride.driver.name} />
                      <AvatarFallback>{getInitials(ride.driver.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{ride.driver.name}</h3>
                        {ride.driver.is_verified && (
                          <CheckCircle2 className="w-5 h-5 text-black" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-black" />
                        {ride.driver.rating.toFixed(1)} ({ride.driver.rating_count} reviews)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {ride.vehicle && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Make & Model</div>
                        <div className="font-medium">{ride.vehicle.make} {ride.vehicle.model}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Color</div>
                        <div className="font-medium">{ride.vehicle.color}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(ride.amenities.air_conditioner !== undefined || ride.amenities.smoking_allowed !== undefined || ride.booking_policies) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(ride.amenities.air_conditioner !== undefined || ride.amenities.smoking_allowed !== undefined) && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Amenities</div>
                        <div className="flex gap-2 flex-wrap">
                          {ride.amenities.air_conditioner && (
                            <Badge variant="outline">Air Conditioner</Badge>
                          )}
                          {!ride.amenities.smoking_allowed && (
                            <Badge variant="outline">Non-smoking</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {ride.booking_policies && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Booking Policies</div>
                        <div className="flex gap-2 flex-wrap">
                          {ride.booking_policies.instant_confirmation && (
                            <Badge variant="outline">Instant Confirmation</Badge>
                          )}
                          <Badge variant="outline">{ride.booking_policies.cancellation_policy}</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingForm
                  rideId={ride.ride_id}
                  availableSeats={ride.available_seats}
                  pricePerSeat={ride.price.amount}
                  currency={ride.price.currency}
                  onSubmit={handleBooking}
                  isLoading={isBooking}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Request Submitted</DialogTitle>
            <DialogDescription>
              Your booking request has been sent to the driver. You will be notified once they respond.
            </DialogDescription>
          </DialogHeader>
          {booking && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Booking ID</span>
                  <span className="font-medium">{booking.booking_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge>{booking.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Passengers</span>
                  <span className="font-medium">{booking.passenger_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Price</span>
                  <span className="font-medium">{formatPrice(booking.total_price)}</span>
                </div>
              </div>
              <Button onClick={() => router.push("/")} className="w-full">
                Back to Search
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
