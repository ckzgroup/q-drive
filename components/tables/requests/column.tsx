"use client"

import {Eye} from "@phosphor-icons/react"
import {Request} from "@/data/requests/schema";
import {ColumnDef} from "@tanstack/react-table"
import {statuses, types} from "@/data/requests/data";
import {format, parseISO} from 'date-fns';

import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button";
import {DataTableColumnHeader} from "@/components/tables/data-table-column-header";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    casualLabourersSchema,
    fuelRefillSchema,
    leaveApplicationSchema,
    pettyCashSchema,
    vehicleInspectionSchema,
    vehicleSupportSchema
} from "@/utils/validations/forms";
import * as z from "zod";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {useRouter} from "next/navigation";
import {Icons} from "@/components/ui/icons";
import useAuthStore from "@/hooks/use-user";
import UseFormattedDate from "@/hooks/use-formatted-date";

interface RequestInfo {
    requestType: string;
    requestId: string;
    status?: string;
}

interface User {
    id: string;
    company_id: string;
    email: string;
    name: string;
    contact: string;
    profile: string;
    url: string;
    slogan: string;
    description: string;
    // Add other user details as needed
}

// FORMS SCHEMAS TYPE DEFINITIONS
type SupportFormData = z.infer<typeof vehicleSupportSchema>
type FuelFormData = z.infer<typeof fuelRefillSchema>
type PettyCashFormData = z.infer<typeof pettyCashSchema>
type CasualLabourersFormData = z.infer<typeof casualLabourersSchema>
type InspectionFormData = z.infer<typeof vehicleInspectionSchema>
type LeaveFormData = z.infer<typeof leaveApplicationSchema>

const DynamicForm = ({requestType, requestId, status }: RequestInfo) => {
    const [loading, setLoading] = useState(false)

    const companyId = useAuthStore((state) => state.getCompanyId());


    // ------------------------------------------------------------------------------
    // GET REQUEST DETAILS TO DISPLAY ON THE MODAL BASED ON REQUEST TYPE
    // ------------------------------------------------------------------------------
    const fetchRequestDetails = async () => {
        const URL = `${process.env.NEXT_PUBLIC_API_URL}/view_request_detail.php?request_id=${requestId}}&request_type=${requestType}`;

        try {
            const res = await fetch(URL);
            const data = await res.json();

            // Extract the `detailslist` array
            const requests = data.detailslist || [];

            return requests;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Re-throw to allow useQuery to handle it
        }
    };


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isPending, error, data: requestDetails } = useQuery({
        queryKey: ['requestDetails', requestId, requestType], // Include requestId in the queryKey
        queryFn: fetchRequestDetails,
    });


    // ------------------------------------------------------------------------------
    // REQUEST CONFIRMATION FORM
    // ------------------------------------------------------------------------------
    const VehicleSupportForm = () => {

        const [loading, setLoading] = useState(false)

        const { request_date, support_cost } = requestDetails[0];

        return (
            <div className='flex flex-col space-y-4 px-2'>
                <h2 className='text-lg font-bold text-primary'>Vehicle Support Form</h2>
                {status === "" && (
                    <>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="request_date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Request Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {request_date ? (
                                                    <span>{request_date}</span>
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="support_cost"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Support Cost</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={support_cost} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                    </>
                )}
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Status comment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    };

    const PettyCashForm = () => {

        const [loading, setLoading] = useState(false)

        const { start_date, allowance_amount } = requestDetails[0];

        return (
            <div className='flex flex-col space-y-4 px-2'>
                <Separator />
                <h2 className='text-lg font-bold text-primary'>Petty Cash Form</h2>
                {status === "" && (
                    <>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {start_date ? (
                                                    <span>{start_date}</span>
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="allowance_amount"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Allowance Amount</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Enter allowance amount" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                    </>
                )}
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Status comment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    };

    const CasualLabourersForm = () => {

        const [loading, setLoading] = useState(false)

        const { start_date, casual_amount } = requestDetails[0];

        return (
            <div className='flex flex-col space-y-4 px-2'>
                <Separator />
                <h2 className='text-lg font-bold text-primary'>Casual Labourers Form</h2>
                {status === "" && (
                    <>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {start_date ? (
                                                    <span>{start_date}</span>
                                                ) : (
                                                    format(field.value, "PPP")
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="casual_amount"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Casual Amount</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={casual_amount} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                </>
                    )}
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Status comment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    };

    const VehicleInspectionForm = () => {

        const [loading, setLoading] = useState(false)

        const { inspection_date, inspection_cost } = requestDetails[0];

        return (
            <div className='flex flex-col space-y-4 px-2'>
                <Separator />
                <h2 className='text-lg font-bold text-primary'>Vehicle Inspection Form</h2>
                {status === "" && (
                    <>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="inspection_date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Inspection Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {inspection_date ? (
                                                    <span>{inspection_date}</span>
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="inspection_cost"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Inspection Cost</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder={inspection_cost} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                    </>
                    )}
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Status comment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

            </div>
        );
    };

    const LeaveApplicationForm = () => {

        const { leave_start_date, leave_end_date } = requestDetails[0];

        return (
            <div className='flex flex-col space-y-4 px-2'>
                <Separator/>
                <h2 className='text-lg font-bold text-primary'>Leave Application Form</h2>
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="leave_start_date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {leave_start_date ? (
                                                    <span>{leave_start_date}</span>
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
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
                        name="leave_end_date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {leave_end_date ? (
                                                    <span>{leave_end_date}</span>
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
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
                        name="comment"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Status comment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    };

    const FuelRefillForm = () => {

        const {fueling_reason, request_date, fuel_amount, user_id, request_id, request_type} = requestDetails[0];

        return (
            <div className='flex flex-col space-y-4 px-2'>
                <h2 className='text-lg font-bold text-primary'>Fuel Refill Form</h2>
                {status === "" && (
                    <>
                        <div className="grid gap-1">
                            <FormField
                                control={form.control}
                                name="request_date"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Request Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {request_date ? (
                                                            <span>{request_date}</span>
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
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
                                name="fuel_amount"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Fuel Amount </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder={fuel_amount} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}
                <div className="grid gap-1">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={loading}
                                        placeholder="Status comment"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

        );

    };

    // MAIN API URL
    const mainUrl = process.env.NEXT_PUBLIC_API_URL;

    const RequestConfig = {
        'Leave Application': {
            formComponent: LeaveApplicationForm,
        },
        'Fuel Refill': {
            formComponent: FuelRefillForm,
        },
        'Vehicle Support': {
            formComponent: VehicleSupportForm,
        },
        'Petty Cash': {
            formComponent: PettyCashForm,
        },
        'Casual Labourers': {
            formComponent: CasualLabourersForm,
        },
        'Vehicle Inspection': {
            formComponent: VehicleInspectionForm,
        },
    };

    // @ts-ignore
    const config = RequestConfig[requestType];
    const FormComponent = config?.formComponent;
    const url = config?.apiUrl;
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    // RENDER FORM BASED ON REQUEST STATUS
    const shouldRenderForm = status === "" || status === "in-progress review";


    // ------------------------------------------------------------------------------
    // REQUEST ONSUBMIT FUNCTION BASED ON REQUEST TYPE
    // ------------------------------------------------------------------------------
    const onSubmitFuelRefill = async (data: FuelFormData) => {

        if (requestType === 'Fuel Refill') {

            const {fueling_reason, request_date, fuel_amount} = requestDetails[0] || {};


            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const https = require('http');
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(`${apiUrl}/confirm_fuel_refill_request.php?fueling_reason=${requestDetails[0]?.fueling_reason}&request_date=${status === "" ? form.getValues('request_date') : request_date}&fuel_amount=${status === "" ? form.getValues('fuel_amount') : fuel_amount}&user_id=${companyId}&request_status=${status == "in-progress review" ? "completed" : "in-progress"}&comment=${form.getValues('comment')}&request_id=${requestId}&request_type=${requestType}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    insecureHTTPParser: true,
                    httpsAgent: httpsAgent
                });

                if (response.status === 200) {
                    toast({
                        title: 'Request updated!',
                        description: 'You have successfully updated request.',
                        variant: 'success',
                    });
                    router.refresh();
                } else {
                    // Handle other HTTP status codes
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again later.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

    };

    const onSubmitVehicleSupport = async (data: SupportFormData) => {

        if (requestType === 'Vehicle Support') {

            const {support_type, request_date, support_cost, request_status} = requestDetails[0];

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const https = require('http');
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(`${apiUrl}/confrim_vehicle_support_request.php?support_type=${support_type}&request_date=${status === "" ? form.getValues('request_date') : request_date}&support_cost=${status === "" ? form.getValues('support_cost') : support_cost}&user_id=${companyId}&request_status=completed&comment=${form.getValues('comment')}&request_id=${requestId}&request_type=${requestType}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    insecureHTTPParser: true,
                    httpsAgent: httpsAgent
                });

                if (response.status === 200) {
                    toast({
                        title: 'Request updated!',
                        description: 'You have successfully updated request.',
                        variant: 'success',
                    });
                    router.refresh();
                } else {
                    // Handle other HTTP status codes
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again later.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

    };

    const onSubmitPettyCash = async (data: PettyCashFormData) => {

        if (requestType === 'Petty Cash') {

            const {allowance_type, start_date, total_days, allowance_amount, request_status} = requestDetails[0];

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const https = require('http');
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(`${apiUrl}/confirm_petty_cash_request.php?allowance_type=${allowance_type}&start_date=${status === "" ? form.getValues('start_date') : start_date}&total_days=${total_days}&allowance_amount=${status === "" ? form.getValues('allowance_amount') : allowance_amount}&user_id=${companyId}&request_status=completed&comment=${form.getValues('comment')}&request_id=${requestId}&request_type=${requestType}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    insecureHTTPParser: true,
                    httpsAgent: httpsAgent
                });

                if (response.status === 200) {
                    toast({
                        title: 'Request updated!',
                        description: 'You have successfully updated request.',
                        variant: 'success',
                    });
                    router.refresh();
                } else {
                    // Handle other HTTP status codes
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again later.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

    };

    const onSubmitCasualLabourers = async (data: CasualLabourersFormData) => {

        if (requestType === 'Casual Labourers') {

            const {work_type, start_date, total_days, casual_amount, request_status} = requestDetails[0];

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const https = require('http');
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(`${apiUrl}/confirm_casual_labourers_request.php?work_type=${work_type}&start_date=${status === "" ? form.getValues('start_date') : start_date}&total_days=${total_days}&casual_amount=${status === "" ? form.getValues('casual_amount') : casual_amount}&user_id=${companyId}&request_status=completed&comment=${form.getValues('comment')}&request_id=${requestId}&request_type=${requestType}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    insecureHTTPParser: true,
                    httpsAgent: httpsAgent
                });

                if (response.status === 200) {
                    toast({
                        title: 'Request updated!',
                        description: 'You have successfully updated request.',
                        variant: 'success',
                    });
                    router.refresh();
                } else {
                    // Handle other HTTP status codes
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again later.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

    };

    const onSubmitVehicleInspection = async (data: InspectionFormData) => {

        if (requestType === 'Vehicle Inspection') {

            const {inspection_type, inspection_date, inspection_cost, request_status} = requestDetails[0];

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const https = require('http');
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(`${apiUrl}/confirm_vehicle_inspection_request.php?inspection_type=${inspection_type}&inspection_date=${status === "" ? form.getValues('inspection_date') : inspection_date}&inspection_cost=${status === "" ? form.getValues('inspection_cost') : inspection_cost}&user_id=${companyId}&request_status=completed&comment=${form.getValues('comment')}&request_id=${requestId}&request_type=${requestType}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    insecureHTTPParser: true,
                    httpsAgent: httpsAgent
                });

                if (response.status === 200) {
                    toast({
                        title: 'Request updated!',
                        description: 'You have successfully updated request.',
                        variant: 'success',
                    });
                    router.refresh();
                } else {
                    // Handle other HTTP status codes
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again later.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

    };

    const onSubmitLeaveApplication = async (data: LeaveFormData) => {

        if (requestType === 'Leave Application') {

            const {leave_type, leave_start_date, leave_end_date, request_status} = requestDetails[0];


            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const https = require('http');
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.post(`${apiUrl}/confirm_leave_application_request.php?leave_type=${leave_type}&leave_start_date=${status === "" ? form.getValues('leave_start_date') : leave_start_date}&leave_end_date=${status === "" ? form.getValues('leave_end_date') : leave_end_date}&user_id=${companyId}&request_status=completed&comment=${form.getValues('comment')}&request_id=${requestId}&request_type=${requestType}`, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    insecureHTTPParser: true,
                    httpsAgent: httpsAgent
                });

                if (response.status === 200) {
                    toast({
                        title: 'Request updated!',
                        description: 'You have successfully updated request.',
                        variant: 'success',
                    });
                    router.refresh();
                } else {
                    // Handle other HTTP status codes
                    setIsLoading(false);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again later.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

    };

    const onSubmitOtherType = async () => {
        // Your other type specific logic here
        // ...
    };


    // ------------------------------------------------------------------------------
    // FORM SUBMISSION BASED ON REQUEST TYPE
    // ------------------------------------------------------------------------------
    let resolver, defaultValues;
    const getOnSubmitFunction = (requestType: string) => {
        switch (requestType) {
            case 'Fuel Refill':
                return onSubmitFuelRefill;
                resolver = zodResolver(fuelRefillSchema);
                defaultValues = {
                    request_date: "",
                    fuel_amount: "",
                    comment: "",
                };
                break;
            case 'Vehicle Support':
                return onSubmitVehicleSupport;
                resolver = zodResolver(vehicleSupportSchema);
                defaultValues = {
                    request_date: "",
                    support_cost: "",
                    request_status: "completed",
                    comment: "",
                };
                break;
            case 'Petty Cash':
                return onSubmitPettyCash;
                resolver = zodResolver(pettyCashSchema);
                defaultValues = {
                        start_date: "",
                        allowance_amount: "",
                        request_status: "completed",
                        comment: "",
                };
                break;
            case 'Casual Labourers':
                return onSubmitCasualLabourers;
                resolver = zodResolver(casualLabourersSchema);
                defaultValues = {
                        start_date: "",
                        casual_amount: "",
                        request_status: "completed",
                        comment: "",
                };
                break;
            case 'Vehicle Inspection':
                return onSubmitVehicleInspection;
                resolver = zodResolver(vehicleInspectionSchema);
                defaultValues = {
                    inspection_date: "",
                    inspection_cost: "",
                    request_status: "completed",
                    comment: "",
                }
                break;
            case 'Leave Application':
                return onSubmitLeaveApplication;
                resolver = zodResolver(leaveApplicationSchema);
                defaultValues = {
                    leave_start_date:  "",
                    leave_end_date: "",
                    comment: "",
                };
                break;
            default:
                return onSubmitOtherType;
        }
    };

    const form = useForm({
        resolver,
        defaultValues,
    });


    // Use the selected onSubmit function in the form
    const onSubmit = async (data: any, event: any) => {
        event.preventDefault;

         // Adjust this based on your actual data structure
        const selectedOnSubmit = getOnSubmitFunction(requestType);

        // Call the selected onSubmit function
        await selectedOnSubmit(data);

    };

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.message}</p>;
    }

    return (
        <div className="w-full">
            <ScrollArea className="h-[100vh] w-full relative pb-24">
                <div className="text-base">
                    {requestType === 'Fuel Refill' && (
                        <div >
                            {requestDetails.map((detail: any, index: number) => (
                                <div key={index} className='flex flex-col space-y-4 pt-8'>
                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Driver Name:</h4>
                                        <span
                                            className='text-foreground font-semibold'> {detail.user_name} </span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.request_date}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Vehicle Plate:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.vehicle_name}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Reason:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.fueling_reason}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Fuel Amount:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.fuel_amount}</span>
                                    </div>
                                    {detail.fueled_amount && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Fueled Amount:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.fueled_amount}</span>
                                        </div>
                                    )}
                                    {detail.fuel_liters && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Fuel Litres:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.fuel_liters}</span>
                                        </div>
                                    )}

                                    {detail.fuel_rate && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Fuel Rate:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.fuel_rate}</span>
                                        </div>
                                    )}

                                    {detail.status_comment && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Status comment:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.status_comment}</span>
                                        </div>
                                    )}

                                    {detail.image_receipt && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Receipt:</h4>
                                            <Image src={`${mainUrl}/uploads/images/${detail.image_receipt}` || ''}
                                                   className='border border-primary rounded-full'
                                                   alt='logo' height={140} width={140} style={{objectFit: "cover"}}/>
                                        </div>
                                    )}

                                    {detail.image_mileage && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Mileage:</h4>
                                            <Image src={`${mainUrl}/uploads/images/${detail.image_mileage}`}
                                                   className='border border-primary rounded-full'
                                                   alt='logo' height={140} width={140} style={{objectFit: "cover"}}/>
                                        </div>
                                    )}

                                    {detail.image_pump && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Pump:</h4>
                                            <Image src={`${mainUrl}/uploads/images/${detail.image_pump}`}
                                                   className='border border-primary rounded-full'
                                                   alt='logo' height={140} width={140} style={{objectFit: "cover"}}/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {requestType === 'Petty Cash' && (
                        <div>
                            {requestDetails.map((detail: any, index: number) => (
                                <div key={index} className='flex flex-col space-y-4 pt-8'>
                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Driver Name:</h4>
                                        <span
                                            className='text-foreground font-semibold'> {detail.user_name} </span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Vehicle:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.vehicle_name}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.start_date}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Allowance Type:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.allowance_type}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Allowance Amount:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.allowance_amount}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Total Day(s):</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.total_days}</span>
                                    </div>

                                    {detail.status_comment && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Status Comment:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.status_comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {requestType === 'Casual Labourers' && (
                        <div>
                            {requestDetails.map((detail: any, index: number) => (
                                <div key={index} className='flex flex-col space-y-4 pt-8'>
                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Driver Name:</h4>
                                        <span
                                            className='text-foreground font-semibold'> {detail.user_name} </span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Vehicle:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.vehicle_name}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.start_date}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Work Type:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.work_type}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Casual Amount:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.casual_amount}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Total Day(s):</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.total_days}</span>
                                    </div>

                                    {detail.status_comment && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Status Comment:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.status_comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {requestType === 'Vehicle Support' && (
                        <div>
                            {requestDetails.map((detail: any, index: number) => (
                                <div key={index} className='flex flex-col space-y-4 pt-8'>
                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Driver Name:</h4>
                                        <span
                                            className='text-foreground font-semibold'> {detail.user_name} </span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Vehicle:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.vehicle_name}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.request_date}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Support Type:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.support_type}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Support Amount:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.support_cost}</span>
                                    </div>

                                    {detail.status_comment && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Status Comment:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.status_comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {requestType === 'Vehicle Inspection' && (
                        <div>
                            {requestDetails.map((detail: any, index: number) => (
                                <div key={index} className='flex flex-col space-y-4 pt-8'>
                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Inspection Type:</h4>
                                        <span
                                            className='text-foreground font-semibold'> {detail.inspection_type} </span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Inspection Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.inspection_date}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Inspection Cost:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.inspection_cost}</span>
                                    </div>


                                    {detail.status_comment && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Status Comment:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.status_comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {requestType === 'Leave Application' && (
                        <div>
                            {requestDetails.map((detail: any, index: number) => (
                                <div key={index} className='flex flex-col space-y-4 pt-8'>
                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Driver Name:</h4>
                                        <span
                                            className='text-foreground font-semibold'> {detail.user_name} </span>
                                    </div>

                                    {detail.leave_type && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Leave Type:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.leave_type}</span>
                                        </div>
                                    )}

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>Start Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.leave_start_date}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4 className=''>End Date:</h4>
                                        <span
                                            className='text-foreground font-semibold'>{detail.leave_end_date}</span>
                                    </div>

                                    {detail.status_comment && (
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Status Comment:</h4>
                                            <span
                                                className='text-foreground font-semibold'>{detail.status_comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Render the rest of your form */}
                </div>
                <Separator className="my-4"/>
                <>
                    {shouldRenderForm && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormComponent/>
                                <div>
                                    <Button type="submit" size='lg' disabled={isLoading}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                        )}
                                        Save changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </>
            </ScrollArea>
        </div>
    );
};

export const columns: ColumnDef<Request>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px] hidden md:block"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px] hidden md:block"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "request_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("request_id")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "request_type",
        header:
            ({column}) => (
                <DataTableColumnHeader column={column} title="Type" className="hidden md:block"/>
            ),
        cell: ({row}) => {
            const type = types.find(
                (type) => type.value === row.getValue("request_type")
            )

            if (!type) {
                return null
            }


            return (
                <div className="hidden md:flex items-center">
                    <Badge variant="outline" className={`border-none text-sm bg-none`}>
                        {type.icon && (
                            <type.icon className={` mr-2 h-5 w-5
                            ${type.label === 'Fuel Refill' ? 'text-[#32CD32]' : ''}
                            ${type.label === 'Casual Laborers' ? 'text-[#FF4500]' : ''}
                            ${type.label === 'Petty Cash' ? 'text-[#FFD700]' : ''}
                            ${type.label === 'Vehicle Maintenance' ? 'text-[#4169E1]' : ''}
                            ${type.label === 'Vehicle Support' ? 'text-[#4169E1]' : ''}
                            ${type.label === 'Vehicle Inspection' ? 'text-[#FF6347]' :''}
                            ${type.label === 'Leave Application' ? 'text-[#9932CC]' :''}
                            
                            `} />
                        )}
                        <span>{type.label}</span>
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "user_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Driver" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("user_name")}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "vehicle_plate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Vehicle"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("vehicle_plate")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },


    {
        accessorKey: "request_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" className="hidden md:block"/>
        ),
        cell: ({ row }) => {
            const formattedDate = UseFormattedDate(row.getValue("request_date"));

            return (
                <div className="w-fit hidden md:block">
                    {formattedDate}
                    {/*{format(new Date(row.getValue("request_date")), 'yyyy-MM-dd')}*/}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            // Implement your filtering logic here
            if (typeof value === 'string') {
                // @ts-ignore
                return row.getValue(id).toLowerCase().includes(value.toLowerCase());
            } else {
                // Handle non-string values (e.g., return true for all)
                return true;
            }
        }
    },


    {
        accessorKey: "request_amount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Amount"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("request_amount")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },

    // {
    //     accessorKey: "approved_amount",
    //     header: ({column}) => (
    //         <DataTableColumnHeader column={column} title="Approved Amount"/>
    //     ),
    //     cell:
    //         ({row}) => <div className="w-fit">{row.getValue("approved_amount")}</div>,
    //     enableSorting:
    //         true,
    //     enableHiding:
    //         false,
    // },
    {
        accessorKey: "request_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("request_status")
            )

            if (!status) {
                return (
                    <div className="flex items-center">
                        <Badge variant='outline' className={` bg-[#8F9CA9] text-white font-semibold`}>
                            <span>pending</span>
                        </Badge>
                    </div>
                )
            }

            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white font-semibold 
                     ${status.label === 'pending' ? 'bg-[#8F9CA9]' : ''}
                     ${status.label === 'in-progress review' ? 'bg-[#FFDE00]' : ''}
                     ${status.label === 'in-progress' ? 'bg-[#FDAF20]' : ''}
                     ${status.label === 'completed' ? 'bg-[#55BA6A]' : ''}
                     ${status.label === 'cancelled' ? 'bg-[#EE3A4E]' : ''}
                     `}>
                        <span>{status.label}</span>
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    // {
    //     accessorKey: "details",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Details" />
    //     ),
    //     cell: ({ row }) => {
    //         const requestId = row.getValue("request_id");
    //         const requestType = row.getValue("request_type");
    //
    //         const URL = `${process.env.NEXT_PUBLIC_API_URL}/view_request_detail.php?request_id=${requestId}&request_type=${requestType}`;
    //         // eslint-disable-next-line react-hooks/rules-of-hooks
    //         const { isPending, error, data } = useQuery({
    //                 queryKey: ['requestDetails', requestId, requestType],
    //             queryFn: async () => {
    //                 try {
    //                     const res = await fetch(URL);
    //                     const data = await res.json();
    //
    //                     // Extract the `detailslist` array
    //                     const requests = data.detailslist || [];
    //
    //                     return requests;
    //                 } catch (error) {
    //                     console.error('Error fetching data:', error);
    //                     throw error; // Re-throw to allow useQuery to handle it
    //                 }
    //             },
    //         });
    //
    //         const requestDetails = Array.isArray(data) ? data.reverse() : [];
    //
    //         return (
    //             <div>
    //                 {requestType === 'Fuel Refill' && (
    //                     <div>
    //                     {requestDetails.map((detail: any, index: number) => (
    //                         <div key={index} className='flex flex-col space-y-2'>
    //
    //                             <div className='flex space-x-2 items-center'>
    //                                 <h4 className=''>Vehicle Plate:</h4>
    //                                 <span
    //                                     className='text-foreground font-semibold'>{detail.vehicle_name}</span>
    //                             </div>
    //
    //                             <div className='flex space-x-2 items-center'>
    //                                 <h4 className=''>Fuel Amount:</h4>
    //                                 <span
    //                                     className='text-foreground font-semibold'>{detail.fuel_amount}</span>
    //                             </div>
    //                             {detail.fueled_amount && (
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Fueled Amount:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.fueled_amount}</span>
    //                                 </div>
    //                             )}
    //                             {detail.fuel_liters && (
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Fuel Litres:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.fuel_liters}</span>
    //                                 </div>
    //                             )}
    //
    //                         </div>
    //                     ))}
    //                 </div>
    //                 )}
    //                 {requestType === 'Petty Cash' && (
    //                     <div>
    //                         {requestDetails.map((detail: any, index: number) => (
    //                             <div key={index} className='flex flex-col space-y-2'>
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Vehicle:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.vehicle_name}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Allowance Amount:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.allowance_amount}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Total Day(s):</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.total_days}</span>
    //                                 </div>
    //
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //                 {requestType === 'Casual Labourers' && (
    //                     <div>
    //                         {requestDetails.map((detail: any, index: number) => (
    //                             <div key={index} className='flex flex-col space-y-2 '>
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Vehicle:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.vehicle_name}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Work Type:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.work_type}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Casual Amount:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.casual_amount}</span>
    //                                 </div>
    //
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //                 {requestType === 'Vehicle Support' && (
    //                     <div>
    //                         {requestDetails.map((detail: any, index: number) => (
    //                             <div key={index} className='flex flex-col space-y-2'>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Vehicle:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.vehicle_name}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Support Type:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.support_type}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Support Amount:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.support_cost}</span>
    //                                 </div>
    //
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //
    //                 {requestType === 'Vehicle Inspection' && (
    //                     <div>
    //                         {requestDetails.map((detail: any, index: number) => (
    //                             <div key={index} className='flex flex-col space-y-2'>
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Inspection Type:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'> {detail.inspection_type} </span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Inspection Date:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.inspection_date}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Inspection Cost:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.inspection_cost}</span>
    //                                 </div>
    //
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //
    //                 {requestType === 'Leave Application' && (
    //                     <div>
    //                         {requestDetails.map((detail: any, index: number) => (
    //                             <div key={index} className='flex flex-col space-y-2'>
    //
    //                                 {detail.leave_type && (
    //                                     <div className='flex space-x-2 items-center'>
    //                                         <h4 className=''>Leave Type:</h4>
    //                                         <span
    //                                             className='text-foreground font-semibold'>{detail.leave_type}</span>
    //                                     </div>
    //                                 )}
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>Start Date:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.leave_start_date}</span>
    //                                 </div>
    //
    //                                 <div className='flex space-x-2 items-center'>
    //                                     <h4 className=''>End Date:</h4>
    //                                     <span
    //                                         className='text-foreground font-semibold'>{detail.leave_end_date}</span>
    //                                 </div>
    //
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //             </div>
    //         );
    //     },
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id))
    //     },
    // },


    {
        id: "action",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Action"/>
        ),
        cell: ({row}) => (

            <div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Eye weight="duotone" className="mr-2 h-5 w-5 text-muted-foreground cursor-pointer"/>
                    </SheetTrigger>
                    <SheetContent className="sm:w-[900px]">
                        <SheetHeader>
                            <SheetTitle
                                className='text-2xl font-bold'> {row.getValue("request_type")} Request</SheetTitle>
                            <SheetDescription>
                                <div>
                                    {/* ADD FETCHED DATA */}
                                    <DynamicForm requestType={row.getValue("request_type")}
                                                 requestId={row.getValue("request_id")}
                                                 status={row.getValue("request_status")}/>
                                </div>
                            </SheetDescription>
                        </SheetHeader>

                        {/*<SheetFooter>*/}
                        {/*    <div className='flex justify-center space-x-2 items-center mt-6'>*/}

                        {/*        <SheetClose asChild>*/}
                        {/*            <Button size='lg' type="submit">Accept</Button>*/}
                        {/*        </SheetClose>*/}

                        {/*        <SheetClose asChild>*/}
                        {/*            <Button size='lg' className='bg-red-500 text-white hover:bg-red-500/90'*/}
                        {/*                    type="reset">Decline</Button>*/}
                        {/*        </SheetClose>*/}
                        {/*    </div>*/}
                        {/*</SheetFooter>*/}
                    </SheetContent>
                </Sheet>
            </div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
        enableHiding: false,
    },

]