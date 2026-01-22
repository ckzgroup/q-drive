"use client";

import React, {useRef} from "react";
import Image from "next/image";
import {Plus} from "lucide-react";
import Link from "next/link";

import {DataTable} from "@/components/tables/drivers/data-table";
import {columns} from "@/components/tables/drivers/column";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";
import generatePDF from "react-to-pdf";
import {CSVLink} from "react-csv";


export default function Drivers() {

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


    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);

    return (
        <div>
                <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                    <div>
                        <h2 className='font-heading text-2xl font-bold'> Drivers </h2>
                        <p className='text-muted-foreground'> Add, access and manage drivers </p>
                    </div>

                    <div className='flex space-x-2 items-center'>
                        <Button variant="outline" className='space-x-1'  onClick={() => generatePDF(targetRef, {filename: `qudrive-drivers-${timestamp}.pdf`})} >
                            <Image src='/images/pdf.svg' alt='logo' height={18} width={18} style={{ objectFit: "cover" }} />
                            <span>Save PDF</span>
                        </Button>

                        <CSVLink data={combinedDrivers} filename={`qudrive-drivers-${timestamp}.csv`}>
                            <Button variant="outline" className='space-x-1'>
                                <Image src='/images/csv.svg' alt='logo' height={18} width={18} style={{ objectFit: "cover" }} />
                                <span>Save CSV</span>
                            </Button>
                        </CSVLink>

                        <Link
                            href="/drivers/new-driver"
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "space-x-1"
                            )}
                        >
                            <Plus className='h-4 w-4'/>
                            <span>Add Driver</span>
                        </Link>
                    </div>
                </div>

            <div ref={targetRef}>
                <DataTable columns={columns} data={combinedDrivers} />
            </div>

        </div>
    );
}

