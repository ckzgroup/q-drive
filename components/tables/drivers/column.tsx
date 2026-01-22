"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { Driver } from "@/data/drivers/schema";

import {DataTableColumnHeader} from "@/components/tables/data-table-column-header";
import { statuses } from "@/data/drivers/data";

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
import {ScrollArea} from "@/components/ui/scroll-area";
import {VehicleEditForm} from "@/components/lib/forms/edit/vehicle-edit-form";
import {DriverEditForm} from "@/components/lib/forms/edit/driver-edit-form";
import {useQuery} from "@tanstack/react-query";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import * as React from "react";

export const columns: ColumnDef<Driver>[] = [
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
        accessorKey: "user_id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell:
            ({row}) => <div className="w-fit">{row.getValue("user_id")}</div>,
        enableSorting:
            true,
        enableHiding:
            false,
    },
    {
        accessorKey: "user_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full Name" className="hidden md:block"/>
        ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("user_name")}</div>,
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "driver_license",
            header: ({ column }) => (
        <DataTableColumnHeader column={column} title="License No" />
    ),
        cell: ({ row }) => <div className="w-fit">{row.getValue("driver_license")}</div>,
        enableSorting: true,
            enableHiding: true,
    },



    {
        accessorKey: "user_id_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="National ID No" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">{row.getValue("user_id_number")}</div>,
        enableSorting: true,
        enableHiding: false,
    },

    {
        accessorKey: "user_contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone No" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">{row.getValue("user_contact")}</div>,
        enableSorting: true,
        enableHiding: false,
    },

    {
        accessorKey: "user_email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email Address" />
        ),
        cell: ({ row }) => <div className="w-fit hidden md:block">{row.getValue("user_email")}</div>,
        enableSorting: true,
        enableHiding: false,
    },

    {
        accessorKey: "user_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("user_status")
            )

            if (!status) {
                return null
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
            const userId = row.getValue("user_id");

            const URL = `${process.env.NEXT_PUBLIC_API_URL}/driver_cost_more.php?user_id=${userId}&title=all`;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {isPending, error, data} = useQuery({
                queryKey: ['userDetails', userId],
                queryFn: async () => {
                    try {
                        const res = await fetch(URL);
                        const responseData = await res.json();

                        // Extract required fields from the response
                        const {
                            error: isError,
                            total_petty_cash,
                            count_petty_cash,
                            total_casual_request,
                            count_casual_request,
                            message,
                            total_fuel_request,
                            count_fuel_request,
                            total_vehicle_support_request,
                            count_vehicle_support_request,
                            count_leave_application,
                            total_vehicle_inspection,
                            count_vehicle_inspection,
                        } = responseData;

                        const userDetails = {
                            isError,
                            total_petty_cash,
                            count_petty_cash,
                            total_casual_request,
                            count_casual_request,
                            message,
                            total_fuel_request,
                            count_fuel_request,
                            total_vehicle_support_request,
                            count_vehicle_support_request,
                            count_leave_application,
                            total_vehicle_inspection,
                            count_vehicle_inspection,
                        };

                        return userDetails;
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        throw error; // Re-throw to allow useQuery to handle it
                    }
                },
            });

            const driver = data;

            // @ts-ignore
            return (
                <div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Eye weight="duotone" className="mr-2 h-5 w-5 text-muted-foreground cursor-pointer"/>
                        </SheetTrigger>
                        <SheetContent className="sm:w-[900px]">
                            <SheetHeader>
                                <SheetTitle
                                    className='text-2xl font-bold'> {row.getValue("user_name")}
                                    Report
                                </SheetTitle>
                                <br/>
                                <SheetDescription>
                                    <div>

                                        <div className='flex flex-col space-y-4'>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Total Petty Cash:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>Ksh {driver?.total_petty_cash}</span>
                                            </div>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Petty Cash Requests:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>{driver?.count_petty_cash}</span>
                                            </div>

                                            <hr/>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Total Casual Money:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>Ksh {driver?.total_casual_request}</span>
                                            </div>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Casual Requests:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>{driver?.count_casual_request}</span>
                                            </div>

                                            <hr/>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Total Fuel Refill:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>Ksh {driver?.total_fuel_request}</span>
                                            </div>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Fuel Refill Requests:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>{driver?.count_fuel_request}</span>
                                            </div>

                                            <hr/>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Total Vehicle Support:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>Ksh {driver?.total_vehicle_support_request}</span>
                                            </div>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Vehicle Support Requests:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>{driver?.count_vehicle_support_request}</span>
                                            </div>

                                            <hr/>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Total Vehicle Inspection:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>Ksh {driver?.total_vehicle_inspection}</span>
                                            </div>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Vehicle Inspection Requests:</h4>
                                                <span
                                                    className='text-foreground font-semibold'>{driver?.count_vehicle_inspection}</span>
                                            </div>
                                            <hr/>

                                            <div className='flex space-x-2 items-center'>
                                                <h4 className=''>Leave Application Requests :</h4>
                                                <span
                                                    className='text-foreground font-semibold'>{driver?.count_leave_application}</span>
                                            </div>

                                        </div>

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
                                <Eye weight="duotone" className="mr-2 h-4 w-4 text-[#420BCB]" />
                                View
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='text-2xl font-bold'> Driver Details </DialogTitle>
                                <DialogDescription>
                                    <div className='flex flex-col space-y-4 pt-8 text-lg'>
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className='text-foreground'>Name:</h4>
                                            <span className=''>{row.getValue("user_name")}</span>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className='text-foreground'>License No: </h4>
                                            <span className=''>{row.getValue("driver_license")}</span>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className='text-foreground'>National ID No: </h4>
                                            <span className=''>{row.getValue("user_id_number")}</span>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className='text-foreground'>Phone No: </h4>
                                            <span className=''>{row.getValue("user_contact")}</span>
                                        </div>
                                        <div className='flex space-x-2 items-center'>
                                            <h4 className='text-foreground'>Email: </h4>
                                            <span className=''>{row.getValue("user_email")}</span>
                                        </div>

                                        <div className='flex space-x-2 items-center'>
                                            <h4 className='text-foreground'>Status:</h4>
                                            <span className=''>{row.getValue("user_status")}</span>
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
                                <DriverEditForm />
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