"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "../data-table-faceted-filter"
import {DataTableViewOptions} from "@/components/tables/data-table-view-options";
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"

import {addDays, format, parse, startOfDay} from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { types, statuses } from "@/data/requests/data";
import React, {useEffect, useState} from "react";
import {cn} from "@/lib/utils";

import { DateRangePicker } from 'react-date-range';
import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";
import useVehicleReport from "@/hooks/use-vehicle-report";
import {CSVLink} from "react-csv";
import Image from "next/image";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {

    // GET DRIVERS
    const companyId = useAuthStore((state) => state.getCompanyId());

    const { data, error } = useQuery({
        queryKey: ['repoData', companyId],
        queryFn: async () => {
            const URL_TRUE = `${process.env.NEXT_PUBLIC_API_URL}/view_driver.php?company_id=${companyId}&status=true&role_status=true`;
            const URL_FALSE = `${process.env.NEXT_PUBLIC_API_URL}/view_driver.php?company_id=${companyId}&status=true&role_status=false`;

            const resTrue = await fetch(URL_TRUE);
            const resFalse = await fetch(URL_FALSE);

            if (!resTrue.ok || !resFalse.ok) {
                throw new Error(`Failed to fetch vehicles: ${!resTrue.ok ? resTrue.statusText : resFalse.statusText}`);
            }

            const dataTrue = await resTrue.json();
            const dataFalse = await resFalse.json();

            // Assuming your API response has a structure like { detailslist: [...] }
            const driversTrue = dataTrue.detailslist || [];
            const driversFalse = dataFalse.detailslist || [];

            return [...driversTrue, ...driversFalse];
        }});

    const combinedDrivers = Array.isArray(data) ? data.reverse() : [];

    // Assuming you have a list of drivers with usernames stored in an array called 'drivers'
    const driversOptions = combinedDrivers.map(driver => ({
        value: driver.user_name,
        label: driver.user_name,
    }));


    // GET VEHICLES
    const { isLoading, error:vehicleError, data:vehicleData } = useVehicleReport(companyId);

    const combinedVehicles = Array.isArray(vehicleData) ? vehicleData.reverse() : [];

    // Assuming you have a list of drivers with usernames stored in an array called 'drivers'
    const vehiclesOptions = combinedVehicles.map(vehicle => ({
        value: vehicle.vehicle_plate,
        label: vehicle.vehicle_plate,
    }));

    const [dateRange, setDateRange] = React.useState<DateRange | number | undefined>({
        from: new Date(),
        to: addDays(new Date(), 0),
    });

    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
    const [selectedYear, setSelectedYear] = useState<number | undefined>();

    const [selectedDriver, setSelectedDriver] = useState<string | undefined>();
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>();

    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length



    // Function to filter data based on selected date range
    const filterDataByDateRange = (range: DateRange | undefined ) => {
        if (!range) return;

        // Check if it's a single date
        if (range instanceof Date) {
            const formattedDate = format(range, "yyyy-MM-dd");
            const requestDateColumn = table.getColumn("request_date");

            if (requestDateColumn) {
            requestDateColumn.setFilterValue(formattedDate);
            } else {
                console.error("Column 'request_date' not found in table configuration");
            }
            // ... (rest of your logic for filtering by single date)
        } else {
            // Existing logic for handling DateRange
            const formattedFrom = range?.from ? format(range?.from,  'yyyy-MM-dd') : '';
            const formattedTo = range?.to ? format(range.to, 'yyyy-MM-dd') : '';

            const requestDateColumn = table.getColumn("request_date");

            if (requestDateColumn) {

                const filterValue = `${formattedFrom}`;
                requestDateColumn.setFilterValue(filterValue);

                 // requestDateColumn.setFilterValue(formattedTo);
                // requestDateColumn.setFilterValue([formattedFrom, formattedTo]);

                // requestDateColumn.setFilterValue((row) => {
                //         return row >= formattedFrom && row <= formattedTo;
                //      });

            } else {
                console.error("Column 'request_date' not found in table configuration");
            }
        }


    };


    // FILTER BY MONTH & YEAR
    const filterDataByMonthAndYear = () => {
        if (selectedMonth !== undefined && selectedYear !== undefined) {
            const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;
            const requestDateColumn = table.getColumn("request_date");

            if (requestDateColumn) {
                requestDateColumn.setFilterValue(formattedDate);
            } else {
                console.error("Column 'request_date' not found in table configuration");
            }
        }
    };


    // Function to filter data based on selected driver
    const filterDataByDriver = () => {
        if (selectedDriver) {
            const driverColumn = table.getColumn("user_name");

            if (driverColumn) {
                driverColumn.setFilterValue(selectedDriver);
            } else {
                console.error("Column 'driver' not found in table configuration");
            }
        }
    };

    // Function to filter data based on selected driver
    const filterDataByVehicle = () => {
        if (selectedVehicle) {
            const vehicleColumn = table.getColumn("vehicle_plate");

            if (vehicleColumn) {
                vehicleColumn.setFilterValue(selectedVehicle);
            } else {
                console.error("Column 'vehicle' not found in table configuration");
            }
        }
    };

    // useEffect hook for filtering by driver & vehicle
    useEffect(() => {
        filterDataByDriver();
    }, [selectedDriver]);

    useEffect(() => {
        filterDataByVehicle();
    }, [selectedVehicle]);


    React.useEffect(() => {
        // @ts-ignore
        filterDataByDateRange(dateRange);
    }, [dateRange]);

    React.useEffect(() => {
        filterDataByMonthAndYear();
    }, [selectedMonth, selectedYear]);


    // Function to export filtered data to CSV
    const handleExportToCSV = () => {
        const filteredRows = table.getFilteredRowModel().rows;
        const csvData = filteredRows.map(row => row.original); // Access original data
        return csvData;
    };

    console.log(table.getColumn("vehicle_plate"))

    return (
        <div className="space-y-4">
            <div className="flex flex-1 items-center space-x-2">
                {/* ... existing toolbar elements like input filters */}

                {/* Add CSV Export Button */}
                <CSVLink //@ts-ignore
                    data={handleExportToCSV()}
                    filename={`QuDrive_Report_${new Date().toISOString()}.csv`}
                    className="btn btn-outline"
                    headers={[
                        { label: "Request Type", key: "request_type" },
                        { label: "Request Date", key: "request_date" },
                        { label: "Driver", key: "user_name" },
                        { label: "Vehicle", key: "vehicle_plate" },
                        { label: "Request Amount", key: "request_amount" },
                        { label: "Approved Amount", key: "approved_amount" },
                        { label: "Reason", key: "reason" },
                        { label: "Status", key: "request_status" },
                    ]} // Custom headers
                >
                    <Button variant="default" className='space-x-1'>
                        <Image src='/images/csv.svg' alt='logo' height={18} width={18}
                               style={{objectFit: "cover"}}/>
                        <span>Export CSV</span>
                    </Button>
                </CSVLink>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter requests..."
                        value={(table.getColumn("user_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("user_name")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                    {table.getColumn("request_type") && (
                        <div className='block'>
                            <DataTableFacetedFilter
                                column={table.getColumn("request_type")}
                                title="Type" //@ts-ignore
                                options={types}
                            />
                        </div>
                    )}
                    {table.getColumn("request_status") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("request_status")}
                            title="Status"
                            options={statuses}
                        />
                    )}

                    {table.getColumn("user_name") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("user_name")}
                            title="Driver"
                            options={driversOptions}
                        />
                    )}

                    {table.getColumn("vehicle_plate") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("vehicle_plate")}
                            title="Vehicle"
                            options={vehiclesOptions}
                        />
                    )}

                    {/*<div className="grid gap-2">*/}
                    {/*    <Popover>*/}
                    {/*        <PopoverTrigger asChild>*/}
                    {/*            <Button*/}
                    {/*                variant={"outline"}*/}
                    {/*                className={cn(*/}
                    {/*                    "w-[240px] justify-start text-left font-normal",*/}
                    {/*                    !dateRange && "text-muted-foreground"*/}
                    {/*                )}*/}
                    {/*            >*/}
                    {/*                <CalendarIcon className="mr-2 h-4 w-4"/>*/}
                    {/*                /!* @ts-ignore *!/*/}
                    {/*                {dateRange?.from ? (dateRange.to ? (*/}
                    {/*                        // @ts-ignore*/}
                    {/*                        <> {format(dateRange.from, "LLL dd, y")} -{" "} {format(dateRange.to, "LLL dd, y")}*/}
                    {/*                        </>*/}
                    {/*                    ) : ( // @ts-ignore*/}
                    {/*                        format(dateRange.from, "LLL dd, y")*/}
                    {/*                    )*/}
                    {/*                ) : (*/}
                    {/*                    <span>Pick a date</span>*/}
                    {/*                )}*/}
                    {/*            </Button>*/}
                    {/*        </PopoverTrigger>*/}
                    {/*        <PopoverContent className="w-auto p-0" align="start">*/}
                    {/*            <Calendar*/}
                    {/*                mode="range" // @ts-ignore*/}
                    {/*                selected={dateRange}*/}
                    {/*                captionLayout="dropdown-buttons"*/}
                    {/*                fromYear={2023}*/}
                    {/*                toYear={2025}*/}
                    {/*                onSelect={(newDate) => {*/}
                    {/*                    setDateRange(newDate);*/}
                    {/*                }}*/}
                    {/*                initialFocus*/}
                    {/*                numberOfMonths={1}*/}
                    {/*            />*/}

                    {/*        </PopoverContent>*/}
                    {/*    </Popover>*/}
                    {/*</div>*/}

                    <div>
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    <span> Filter by Month & Year</span>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="flex items-center space-x-2">
                                <select
                                    value={selectedMonth ?? ""}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="py-1 px-2"
                                >
                                    <option value="">Select Month</option>
                                    {/* Render options for months */}
                                    {/* You can customize this based on your needs */}
                                    {Array.from({length: 12}, (_, i) => i + 1).map((month) => (
                                        <option key={month} value={month}>
                                            {format(new Date(2000, month - 1), "MMMM")}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear ?? ""}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="py-1 px-2"
                                >
                                    <option value="">Select Year</option>
                                    {/* Render options for years */}
                                    {/* You can customize this based on your needs */}
                                    {Array.from({length: 2}, (_, i) => new Date().getFullYear() - i).map(
                                        (year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        )
                                    )}
                                </select>

                            </PopoverContent>
                        </Popover>
                    </div>


                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4"/>
                        </Button>
                    )}
                </div>

                <DataTableViewOptions table={table}/>

            </div>
        </div>
    )
}