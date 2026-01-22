"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"


import {Button, buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/ui/icons";
import { driverSchema } from "@/utils/validations/forms";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import { addDays, format } from "date-fns"
import {cn} from "@/lib/utils";


interface DriversFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof driverSchema>

export function DriverEditForm({ className, ...props }: DriversFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(driverSchema),
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const router = useRouter();

    async function onSubmit(data: FormData) {
        setIsLoading(true);

        router.back();

        toast({
            title: "Driver successfully added!",
            variant: "success"
        })

        setIsLoading(false)

    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <div className='pb-12'>
                        <div className='mb-5 space-y-2'>
                            <h1 className='text-lg font-bold font-heading'> Personal Information </h1>
                            <p className='text-muted-foreground'> Fill the driver’s personal information </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="user_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={isLoading}
                                                       placeholder="Enter driver’s name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({field}) => (// @ts-ignore
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input disabled={isLoading} placeholder="Enter DOB" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Gender"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
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
                                    name="id_number"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>National ID No</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter driver’s ID No" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="user_contact"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Phone number" {...field} />
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
                            <h1 className='text-lg font-bold font-heading'> Authentication Details </h1>
                            <p className='text-muted-foreground'> Fill the driver’s authentication information </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="user_email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter driver’s email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter driver’s password" {...field} />
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
                            <h1 className='text-lg font-bold font-heading'> Driver's License </h1>
                            <p className='text-muted-foreground'> Fill the driver’s license information </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="driver_license"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>License Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter driver’s license number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="license_class"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>License Class</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter license class" {...field} />
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
                            <h1 className='text-lg font-bold font-heading'> Emergency Contact </h1>
                            <p className='text-muted-foreground'> Fill the driver’s emergency contact information </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="emergency_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Emergency Contact Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="emergency_relation"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Relationship</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter relationship" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="emergency_contact"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter phone number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>


                    <div className=''>
                        <Button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Add Driver
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}
