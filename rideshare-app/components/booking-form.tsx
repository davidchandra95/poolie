"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBookingRequest } from "@/lib/types";

const bookingFormSchema = z.object({
  passenger_count: z.number().min(1, "At least 1 passenger is required"),
  message: z.string().max(500, "Message must be 500 characters or less").optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  rideId: string;
  availableSeats: number;
  pricePerSeat: number;
  currency: string;
  onSubmit: (data: CreateBookingRequest) => Promise<void>;
  isLoading?: boolean;
}

export function BookingForm({
  rideId,
  availableSeats,
  pricePerSeat,
  currency,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passenger_count: 1,
      message: "",
    },
  });

  const passengerCount = form.watch("passenger_count");
  const totalPrice = passengerCount * pricePerSeat;

  async function handleSubmit(values: BookingFormValues) {
    await onSubmit({
      ride_id: rideId,
      passenger_count: values.passenger_count,
      message: values.message || undefined,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book this ride</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="passenger_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of passengers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max={availableSeats}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    Available seats: {availableSeats}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to driver (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Can you pick me up near the train station?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any pickup or drop-off preferences
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Price per seat
                </span>
                <span className="font-medium">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: currency,
                    minimumFractionDigits: 0,
                  }).format(pricePerSeat)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Passengers
                </span>
                <span className="font-medium">{passengerCount}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: currency,
                      minimumFractionDigits: 0,
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Booking..." : "Request to Book"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
