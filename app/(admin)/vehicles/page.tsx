"use client";

import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Plus} from "lucide-react";
import Link from "next/link";
import { CSVLink, CSVDownload } from "react-csv";
import generatePDF from 'react-to-pdf';

import {DataTable} from "@/components/tables/vehicles/data-table";
import {columns} from "@/components/tables/vehicles/column";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";
import useCombinedRequestData from "@/hooks/use-company-cost";
import useVehicleReport from "@/hooks/use-vehicle-report";

export default  function Vehicles() {
    const companyId = useAuthStore((state) => state.getCompanyId());

    const { isLoading, error, data, refetch } = useVehicleReport(companyId);

    useEffect(() => {
        refetch(); // Optionally refetch the data on component mount
    }, [companyId, refetch]);

    const combinedVehicles = Array.isArray(data) ? data.reverse() : [];

    console.log(combinedVehicles);

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);


    return (
        <div>
                <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                    <div>
                        <h2 className='font-heading text-2xl font-bold'> Vehicles </h2>
                        <p className='text-muted-foreground'> Add, access and manage company vehicles </p>
                    </div>

                    <div className='flex space-x-2 items-center'>
                        <Button variant="outline" className='space-x-1'  onClick={() => generatePDF(targetRef, {filename: `qudrive-vehicles-${timestamp}.pdf`})} >
                            <Image src='/images/pdf.svg' alt='logo' height={18} width={18} style={{ objectFit: "cover" }} />
                            <span>Save PDF</span>
                        </Button>

                    <CSVLink data={combinedVehicles} filename={`qudrive-vehicles-${timestamp}.csv`}>
                    <Button variant="outline" className='space-x-1'>
                            <Image src='/images/csv.svg' alt='logo' height={18} width={18} style={{ objectFit: "cover" }} />
                            <span>Save CSV</span>
                        </Button>
                    </CSVLink>

                        <Link
                              href="/vehicles/new-vehicle"
                              className={cn(
                                  buttonVariants({ variant: "default" }),
                                  "space-x-1"
                              )}
                        >
                            <Plus className='h-4 w-4'/>
                            <span>Add Vehicle</span>
                        </Link>
                    </div>

                </div>
            <div ref={targetRef}>
                <DataTable  columns={columns} data={combinedVehicles} />
            </div>

        </div>
    );
}

