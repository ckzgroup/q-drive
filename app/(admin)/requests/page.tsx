"use client";

import React, {useEffect, useRef, useState} from "react";

import {DataTable} from "@/components/tables/requests/data-table";
import {columns} from "@/components/tables/requests/column";
import useAuthStore from "@/hooks/use-user";
import {Button, buttonVariants} from "@/components/ui/button";
import generatePDF from "react-to-pdf";
import Image from "next/image";
import {CSVLink} from "react-csv";
import useCombinedRequestData from "@/hooks/use-company-cost";
import Loading from "@/app/(admin)/loading";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";

interface Request {
    request_type: string;
    request_date: string;
    user_name: string;
    status: string;
}

export default function Requests() {
    const companyId = useAuthStore((state) => state.getCompanyId());

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/all_company_request.php?company_id=${companyId}`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isPending:isLoading, error, data } = useQuery({
        queryKey: ['requestDetails', companyId],
        queryFn: async () => {
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
        },
    });

    const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);


    const requests = Array.isArray(data) ? data.reverse() : [];


    const table = useReactTable({ columns, data: requests, getCoreRowModel: getCoreRowModel() })

    useEffect(() => {
        const filteredRows = table.getFilteredRowModel().rows;
        const requestsData = filteredRows.map((row) => row.original); // Extract request data from each row
        setFilteredRequests(requestsData); // Update filtered requests data
    }, [table]);

    // Export to PDF
    const targetRef = useRef(null);
    const timestamp = new Date().toISOString().slice(0, 10);


    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Request </h2>
                    <p className='text-muted-foreground'> Access and manage request details </p>
                </div>
            </div>

            <div ref={targetRef}>
                {
                    !isLoading ? (
                        <DataTable columns={columns} data={requests}/>
                    ) : (
                        <Loading/>
                    )
                }
            </div>
        </div>
    );
}

