"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios";


import {Button, buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/ui/icons";
import { vehicleSchema } from "@/utils/validations/forms";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import {useState} from "react";
import useAuthStore from "@/hooks/use-user";



interface VehiclesFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof vehicleSchema>

export function VehiclesForm({ className, ...props }: VehiclesFormProps) {

    const companyId = useAuthStore((state) => state.getCompanyId());
    const authStore = useAuthStore();
    const user = authStore.user;

    const form = useForm<FormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: { // @ts-ignore
            company_id: companyId,
            vehicle_type: "",
            vehicle_make: "",
            vehicle_model: "",
            chassis: "",
            vehicle_plate: "",
            mileage: "",
            insurance_name: "",
            insurance_policy_no: "",
            insurance_expiry_date: new Date,
            fuel_type: "",
            fuel_efficiency: "",
            fuel_capacity: "",
            last_service_date: new Date,
            next_service_date: new Date,
        }

    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const https = require('http');
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });

            const response = await axios.post(`${apiUrl}/register_vehicle.php?vehicle_type=${form.getValues('vehicle_type')}&vehicle_make=${form.getValues('vehicle_make')}&vehicle_model=${form.getValues('vehicle_model')}&chassis=${form.getValues('chassis')}&vehicle_plate=${form.getValues('vehicle_plate')}&mileage=${form.getValues('mileage')}&company_id=20
            &insurance_name=${form.getValues('insurance_name')}&insurance_policy_no=${form.getValues('insurance_policy_no')}&insurance_expiry_date=${form.getValues('insurance_expiry_date')}&fuel_type=${form.getValues('fuel_type')}&fuel_efficiency=${form.getValues('fuel_efficiency')}&fuel_capacity=${form.getValues('fuel_capacity')}&last_service_date=${form.getValues('last_service_date')}&next_service_date=${form.getValues('next_service_date')}`,
                data, {
                headers: {
                    "Content-Type": "application/json",
                },
                insecureHTTPParser: true,
                httpsAgent: httpsAgent
            });
            if (response.status === 200) {
                const vehicle = response.data;
                    router.push("/vehicles");
                    toast({
                        title: "Vehicle Created!",
                        description: "You have successfully added a new vehicle.",
                        variant: "success"
                    });

            } else {
                // Handle other HTTP status codes
                console.log("Error");
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='pb-12'>
                        <div className='mb-5 space-y-2'>
                            <h1 className='text-lg font-bold font-heading'> Vehicle Information </h1>
                            <p className='text-muted-foreground'> Fill the vehicle’s information </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="vehicle_type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Type</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter vehicle type" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="vehicle_make"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Make</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter vehicle make" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="vehicle_model"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Model</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter vehicle model" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="chassis"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Chassis</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter chassis" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="vehicle_plate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>License Plate Number</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter license plate number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="mileage"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Current Mileage</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter mileage" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                    </div>


                    <div className='pb-12'>
                        <div className='mb-5 space-y-2'>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            <h1 className='text-lg font-bold font-heading'> Insurance Details </h1>
                            <p className='text-muted-foreground'> Fill the insurance company details </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="insurance_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Insurance Company</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Entre company name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="insurance_policy_no"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Policy Number</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter policy number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="insurance_expiry_date"
                                    render={({field}) => (// @ts-ignore
                                        <FormItem>
                                            <FormLabel>Insurance Expiry Date</FormLabel>
                                            <br/>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[280px] justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>DD/MM/YYYY</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                                    <div className="rounded-md border">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onDayClick={field.onChange}
                                                            initialFocus
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>


                    <div className='pb-12'>
                        <div className='mb-5 space-y-2'>
                            <h1 className='text-lg font-bold font-heading'> Fuel Information </h1>
                            <p className='text-muted-foreground'> Fill the fuel information for the vehicle </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="fuel_type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Fuel Type</FormLabel>
                                            <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue  placeholder="Select Fuel Type"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Diesel"> Diesel </SelectItem>
                                                    <SelectItem value="Petrol"> Petrol </SelectItem>
                                                    <SelectItem value="Hybrid"> Hybrid </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="fuel_efficiency"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Fuel Efficiency</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter fuel efficiency" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="fuel_capacity"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Fuel Capacity</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter fuel capacity" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>


                    <div className='pb-12'>
                        <div className='mb-5 space-y-2'>
                            <h1 className='text-lg font-bold font-heading'> Maintenance Information </h1>
                            <p className='text-muted-foreground'> Fill vehicle’s maintenance details </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="last_service_date"
                                    render={({field}) => (// @ts-ignore
                                        <FormItem>
                                            <FormLabel>Last Service Date</FormLabel>
                                            <br/>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[280px] justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>DD/MM/YYYY</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                                    <div className="rounded-md border">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onDayClick={field.onChange}
                                                            initialFocus
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="next_service_date"
                                    render={({field}) => (// @ts-ignore
                                        <FormItem>
                                            <FormLabel>Next Service Date</FormLabel>
                                            <br/>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[280px] justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>DD/MM/YYYY</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                                    <div className="rounded-md border">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onDayClick={field.onChange}
                                                            initialFocus
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className= "space-x-2 mt-4"
                            disabled={loading}
                        >
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            <span>Add Vehicle</span>
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}
