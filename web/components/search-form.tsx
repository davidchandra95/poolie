"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SearchParams } from "@/lib/types";

const searchFormSchema = z.object({
  originCity: z.string().optional(),
  originLocation: z.string().optional(),
  destinationCity: z.string().optional(),
  destinationLocation: z.string().optional(),
  date: z.date({
    message: "Date is required",
  }),
  passengers: z.number().min(1).optional(),
  type: z.enum(["all", "carpool", "bus"]).optional(),
}).refine(
  (data) => {
    const hasOrigin = (data.originCity && data.originCity !== "all") || (data.originLocation && data.originLocation.trim().length > 0);
    const hasDestination = (data.destinationCity && data.destinationCity !== "all") || (data.destinationLocation && data.destinationLocation.trim().length > 0);
    return hasOrigin || hasDestination;
  },
  {
    message: "Please provide at least origin or destination",
    path: ["originLocation"],
  }
);

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
  defaultValues?: Partial<SearchParams>;
}

export function SearchForm({ onSearch, isLoading, defaultValues }: SearchFormProps) {
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      originCity: defaultValues?.originCity || "all",
      originLocation: defaultValues?.originLocation || "",
      destinationCity: defaultValues?.destinationCity || "all",
      destinationLocation: defaultValues?.destinationLocation || "",
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      passengers: defaultValues?.passengers || 1,
      type: (defaultValues?.type as "all" | "carpool" | "bus") || "all",
    },
  });

  const formatDateDisplay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      return "Hari ini";
    } else if (selectedDate.getTime() === tomorrow.getTime()) {
      return "Besok";
    } else {
      return format(date, "EEE, dd MMM");
    }
  };

  function onSubmit(values: SearchFormValues) {
    onSearch({
      originCity: values.originCity && values.originCity !== "all" ? values.originCity : undefined,
      originLocation: values.originLocation && values.originLocation.trim() ? values.originLocation : undefined,
      destinationCity: values.destinationCity && values.destinationCity !== "all" ? values.destinationCity : undefined,
      destinationLocation: values.destinationLocation && values.destinationLocation.trim() ? values.destinationLocation : undefined,
      date: format(values.date, "yyyy-MM-dd"),
      passengers: values.passengers,
      type: values.type === "all" ? undefined : values.type,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        {/* Departure Location */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <span>Departure location</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="originCity"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-0 h-12 text-base">
                        <SelectValue placeholder="All Cities" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="bandung">Bandung</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                      <SelectItem value="semarang">Semarang</SelectItem>
                      <SelectItem value="medan">Medan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originLocation"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <Input
                      placeholder="Address or location"
                      className="bg-white border-0 h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Destination Location */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <div className="w-2 h-2 bg-black"></div>
            <span>Destination location</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-0 h-12 text-base">
                        <SelectValue placeholder="All Cities" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="bandung">Bandung</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                      <SelectItem value="semarang">Semarang</SelectItem>
                      <SelectItem value="medan">Medan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationLocation"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <Input
                      placeholder="Address or location"
                      className="bg-white border-0 h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Date, Passengers, Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal bg-gray-100 border-0 hover:bg-gray-200",
                          !field.value && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          formatDateDisplay(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDatePickerOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passengers"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      min="1"
                      placeholder="Passengers"
                      className="bg-gray-100 border-0 h-12 text-base pl-10"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-100 border-0 h-12 text-base">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="carpool">Carpool</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-base"
            disabled={isLoading}
          >
            {isLoading ? "Mencari..." : "Cari tumpangan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
