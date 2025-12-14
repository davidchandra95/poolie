"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, UserIcon, Search, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchModificationProps {
    defaultValues?: Partial<SearchParams>;
}

export function SearchModification({ defaultValues }: SearchModificationProps) {
    const router = useRouter();
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
        const params = new URLSearchParams();
        if (values.originCity && values.originCity !== "all") params.set("originCity", values.originCity);
        if (values.originLocation) params.set("originLocation", values.originLocation);
        if (values.destinationCity && values.destinationCity !== "all") params.set("destinationCity", values.destinationCity);
        if (values.destinationLocation) params.set("destinationLocation", values.destinationLocation);
        if (values.date) params.set("date", format(values.date, "yyyy-MM-dd"));
        if (values.passengers) params.set("passengers", values.passengers.toString());
        if (values.type && values.type !== "all") params.set("type", values.type);

        router.push(`/search?${params.toString()}`);
    }

    return (
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-3 items-end lg:items-center">

                        {/* Origin */}
                        <div className="flex-1 w-full lg:w-auto grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="originCity"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-50 border-0 h-10 text-sm">
                                                    <SelectValue placeholder="From City" />
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
                                                placeholder="From Location"
                                                className="bg-gray-50 border-0 h-10 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Arrow Icon (Hidden on mobile, visible on desktop) */}
                        <div className="hidden lg:block text-gray-400">
                            <ArrowRight className="h-5 w-5" />
                        </div>

                        {/* Destination */}
                        <div className="flex-1 w-full lg:w-auto grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="destinationCity"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray-50 border-0 h-10 text-sm">
                                                    <SelectValue placeholder="To City" />
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
                                                placeholder="To Location"
                                                className="bg-gray-50 border-0 h-10 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date & Passengers */}
                        <div className="flex w-full lg:w-auto gap-2">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="space-y-0 flex-1 lg:w-[140px]">
                                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full h-10 justify-start text-left font-normal bg-gray-50 border-0 hover:bg-gray-100 text-sm px-3",
                                                            !field.value && "text-gray-500"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                                        {field.value ? (
                                                            formatDateDisplay(field.value)
                                                        ) : (
                                                            <span>Date</span>
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
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passengers"
                                render={({ field }) => (
                                    <FormItem className="space-y-0 w-[80px]">
                                        <FormControl>
                                            <div className="relative">
                                                <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    className="bg-gray-50 border-0 h-10 text-sm pl-8 pr-2"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="h-10 bg-black hover:bg-gray-800 text-white w-full lg:w-auto px-6 transition-colors">
                            <Search className="h-4 w-4 lg:mr-2" />
                            <span className="lg:inline">Search</span>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
