"use client"
import React from 'react';
import getRequests from "@/actions/get-requests";
import {DataTable} from "@/components/tables/requests/data-table";
import {columns} from "@/components/tables/requests/column";

async function RequestsTable() {
    const data = await getRequests()

    return (
        <div className="col-span-4 mt-16">
            <div className='flex items-center space-x-2 mb-8'>
                <span className='text-lg font-bold'>Recent Requests</span>
            </div>
            <DataTable columns={columns} data={data}/>
        </div>
    );
}

export default RequestsTable;