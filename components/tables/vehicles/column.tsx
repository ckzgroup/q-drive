"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { Vehicle } from "@/data/vehicles/schema";

import {DataTableColumnHeader} from "@/components/tables/data-table-column-header";
import {statuses} from "@/data/vehicles/data";


import { DotsThreeOutline, Eye, PencilSimple, Trash } from "@phosphor-icons/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VehicleEditForm} from "@/components/lib/forms/edit/vehicle-edit-form";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import * as React from "react";
import {useState} from "react";
import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import https from "http";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    casualLabourersSchema,
    fuelRefillSchema, leaveApplicationSchema,
    pettyCashSchema, vehicleInspectionSchema,
    vehicleSupportSchema
} from "@/utils/validations/forms";
import {useForm} from "react-hook-form";
import Image from "next/image";
import {Icons} from "@/components/ui/icons";

interface RequestInfo {
    requestType: string;
    requestId: string;
    status?: string;
}


export const columns: ColumnDef<Vehicle>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
aria-label="Select all"
className="translate-y-[2px] hidden md:block"
    />
),
cell: ({ row }) => (
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
        accessorKey: "vehicle_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("vehicle_id")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "vehicle_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("vehicle_type")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "vehicle_make",
            header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Make" />
    ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("vehicle_make")}</div>,
        enableSorting: true,
            enableHiding: true,
    },

    {
        accessorKey: "vehicle_model",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Model" />
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("vehicle_model")}</div>,
        enableSorting: true,
        enableHiding: true,
    },


    {
        accessorKey: "vehicle_plate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Plate No" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">{row.getValue("vehicle_plate")}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "chassis",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Chassis" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">{row.getValue("chassis")}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "mileage",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mileage" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">{row.getValue("mileage")}</div>,
        enableSorting: true,
        enableHiding: false,
    },

    {
        accessorKey: "vehicle_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("vehicle_status")
            )

            if (!status) {
                return null;
            }

            return (
                <div className="flex items-center">
                    <Badge variant="outline" className={`border-none text-white font-medium tracking-wide
                     ${status.label === 'true' ? 'bg-[#663DCD]' : ''}
                     ${status.label === 'false' ? 'bg-[#B5BEC6]' : ''}
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


    {
        id: "report",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Report" className="text-sm" />
        ),
        cell: ({ row }) => {

            const vehicleId = row.getValue("vehicle_id");

            const URL = `${process.env.NEXT_PUBLIC_API_URL}/per_vehicle_cost.php?vehicle_id=${vehicleId}`;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {isPending, error, data} = useQuery({
                queryKey: ['vehicleDetails', vehicleId],
                queryFn: async () => {
                    try {
                        const res = await fetch(URL);
                        const data = await res.json();

                        // Extract the `detailslist` array
                        const vehicleDetails = data.detailslist || [];

                        return vehicleDetails;
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        throw error; // Re-throw to allow useQuery to handle it
                    }
                },
            });

            const vehicleDetails = Array.isArray(data) ? data.reverse() : [];

            console.log(vehicleDetails)

            return (
                <div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Eye weight="duotone" className="mr-2 h-5 w-5 text-muted-foreground cursor-pointer"/>
                        </SheetTrigger>
                        <SheetContent className="sm:w-[900px]">
                            <SheetHeader>
                                <SheetTitle
                                    className='text-2xl font-bold'> {row.getValue("vehicle_plate")} Report </SheetTitle>
                                <SheetDescription>
                                    <div>
                                        {vehicleDetails.map((detail: any, index: number) => (
                                            <div key={index} className='flex flex-col space-y-4'>

                                                {detail.total_vehicle_inspection && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Vehicle Inspection:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>KSh {detail.total_vehicle_inspection}</span>
                                                    </div>
                                                )}

                                                {detail.total_fuel_request && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Total Fuel Request:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>KSh {detail.total_fuel_request}</span>
                                                    </div>
                                                )}

                                                {detail.total_vehicle_support_request && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Total Vehicle Support:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>KSh {detail.total_vehicle_support_request}</span>
                                                    </div>
                                                )}

                                                {detail.total_petty_cash && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Total Petty Cash Requests:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>KSh {detail.total_petty_cash}</span>
                                                    </div>
                                                )}

                                                {detail.total_casual_request && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Total Casual Requests:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>KSh {detail.total_casual_request}</span>
                                                    </div>
                                                )}

                                                {detail.count_vehicle_inspection && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Total Inspections:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>{detail.count_vehicle_inspection}</span>
                                                    </div>
                                                )}

                                                {detail.count_fuel_request && (
                                                    <div className='flex space-x-2 items-center'>
                                                        <h4 className=''>Fuel Requests:</h4>
                                                        <span
                                                            className='text-foreground font-semibold'>{detail.count_fuel_request}</span>
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                </SheetDescription>
                            </SheetHeader>

                        </SheetContent>
                    </Sheet>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting:
            true,
        enableHiding:
            false,
    },

    {
        id: "action",
        cell: ({row}) => (

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <DotsThreeOutline
                        weight="fill"
                        aria-label="Select row"
                        className="hover:cursor-pointer translate-y-[2px] text-muted-foreground"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <Dialog>
                        <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Eye weight="duotone" className="mr-2 h-4 w-4 text-[#420BCB]"/>
                                View
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='text-2xl font-bold'> Vehicle Details </DialogTitle>
                                <DialogDescription>
                                    <div className='grid grid-cols-2 gap-6 pt-8 text-lg'>
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className=''>Type</h4>
                                            <span className='text-foreground'>{row.getValue("vehicle_type")}</span>
                                    </div>
                                    <div className='flex space-x-2 items-center'>
                                        <h4>Make</h4>
                                        <span className='text-foreground'>{row.getValue("vehicle_make")}</span>
                                    </div>
                                    <div className='flex space-x-2 items-center'>
                                        <h4>Model</h4>
                                        <span className='text-foreground'>{row.getValue("vehicle_model")}</span>
                                    </div>
                                    <div className='flex space-x-2 items-center'>
                                        <h4>Plate No</h4>
                                        <span className='text-foreground'>{row.getValue("vehicle_plate")}</span>
                                    </div>
                                    <div className='flex space-x-2 items-center'>
                                        <h4>Chassis</h4>
                                        <span className='text-foreground'>{row.getValue("chassis")}</span>
                                    </div>
                                    <div className='flex space-x-2 items-center'>
                                        <h4>Mileage</h4>
                                        <span className='text-foreground'>{row.getValue("mileage")}</span>
                                    </div>

                                    <div className='flex space-x-2 items-center'>
                                        <h4>Status</h4>
                                        <span className='text-foreground'>{row.getValue("vehicle_status")}</span>
                                    </div>

                                </div>

                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <DropdownMenuSeparator/>

                <Dialog>
                    <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <PencilSimple weight="duotone" className="mr-2 h-4 w-4 text-muted-foreground/70" />
                    Edit
                </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className='max-w-xl py-4'>
                        <ScrollArea className="h-screen w-full pr-3 py-4 flex flex-col space-y-6 justify-between">
                        <VehicleEditForm />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                <DropdownMenuSeparator />

                <Dialog>
                    <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash weight="duotone" className="mr-2 h-4 w-4 text-[#F03D52]" />
                    Delete
                </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className='space-y-4'>
                            <DialogTitle className='text-2xl font-bold text-red-500 text-center'>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className='text-base text-center'>
                                 Are you sure you want to permanently
                                delete this record? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex justify-center space-x-2 items-center mt-4'>
                            <DialogClose asChild>
                                <Button variant='outline' type="reset">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit">Delete</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>

                </Dialog>

            </DropdownMenuContent>
        </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
    },



]