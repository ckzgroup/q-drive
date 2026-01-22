"use client"

import React, {useEffect, useRef} from "react";
import { GasPump, Users, Money, Wrench, Toolbox, MagnifyingGlass, Calendar, FolderSimple, Icon } from "@phosphor-icons/react"
import {Button} from "@/components/ui/button";
import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";
import generatePDF from "react-to-pdf";
import {CSVLink} from "react-csv";
import {DataTable} from "@/components/tables/requests/data-table";
import {columns} from "@/components/tables/requests/column";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import useCombinedRequestData from "@/hooks/use-company-cost";

type ReportProps = {
    req: any;
    name: string;
    icon: Icon | any;
    iconColor: string;
    update: any;
    percentage: string | number;
    bg: string;
    text: string;
};


export default function Reports() {

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


    const requests = Array.isArray(data) ? data.reverse() : [];


    // FILTER REQUEST BY TYPE
    const filterRequestsByType = (requestType: string, requests: any) => {
        return requests.filter((request: { request_type: string; }) => request.request_type === requestType);
    };

    const fuelRequests = filterRequestsByType('Fuel Refill', requests);
    const cashRequests = filterRequestsByType('Petty Cash', requests);
    const supportRequests = filterRequestsByType('Vehicle Support', requests);
    const labourersRequests = filterRequestsByType('Casual Labourers', requests);
    const leaveRequests = filterRequestsByType('Leave Application', requests);


    // Filter requests based on request status
    const totalRequestsLength = requests.length;
    const totalFuelRequests = filterRequestsByType('Fuel Refill', requests).length;
    const totalCashRequests = filterRequestsByType('Petty Cash', requests).length;
    const totalSupportRequests = filterRequestsByType('Vehicle Support', requests).length;
    const totalLabourersRequests = filterRequestsByType('Casual Labourers', requests).length;
    const totalLeaveRequests = filterRequestsByType('Leave Application', requests).length;

    // Calculate percentages with two decimal places
    const fuelPercentage = totalRequestsLength > 0 ? ((totalFuelRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const cashPercentage = totalRequestsLength > 0 ? ((totalCashRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const supportPercentage = totalRequestsLength > 0 ? ((totalSupportRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const labourersPercentage = totalRequestsLength > 0 ? ((totalLabourersRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const leavePercentage = totalRequestsLength > 0 ? ((totalLeaveRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';


    // Export to PDF
    const targetRef = useRef(null);

    // GET CURRENT TIME
    const timestamp = new Date().toLocaleString();


    const reports: ReportProps[] = [
        { req: requests, name: 'Full Report', icon: FolderSimple, iconColor: "#", update: timestamp, percentage: "100%", bg: "#0E1428", text: "#FFFFFF"},
        { req: fuelRequests, name: 'Fuel Refill', icon: GasPump, iconColor: "#32CD32", update: timestamp, percentage: fuelPercentage, bg: "#E0F8E0", text: "#0E1428"},
        { req: cashRequests, name: 'Petty Cash', icon: Money, iconColor: "#FFD700", update: timestamp, percentage: cashPercentage, bg: "#FFF9D9", text: "#0E1428"},
        { req: labourersRequests, name: 'Casual Laborers', icon: Users, iconColor: "#FF4500", update: timestamp, percentage: labourersPercentage, bg: "#FFE3D9", text: "#0E1428"},
        { req: supportRequests, name: 'Vehicle Support', icon: Wrench, iconColor: "#4169E1", update: timestamp, percentage: supportPercentage, bg: "#E3E9FB", text: "#0E1428"},
        // { name: 'Vehicle Inspection', icon: MagnifyingGlass, iconColor: "#FF6347", update: timestamp, percentage: "2.5%", bg: "#FFE8E3", text: "#0E1428"},
        { req: leaveRequests, name: 'Leave Application', icon: Calendar, iconColor: "#9932CC", update: timestamp, percentage: leavePercentage, bg: "#F0E0F7", text: "#0E1428"},
    ];

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between gap-6  mb-8'>
                <div>
                    <h2 className='font-heading text-2xl font-bold'> Reports </h2>
                    <p className='text-muted-foreground'> Access and manage all the reports </p>
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
            <div className="">
                {reports.map(({ req,name, icon: Icon, update, percentage, iconColor, bg, text }, index) => (
                    // @ts-ignore
                    <AccordionItem value={index} key={index}>
                        <AccordionTrigger>
                    <div  className={`w-[90%] grid grid-cols-3 md:grid-cols-5 items-center gap-x-2 p-4 my-4 rounded-xl border border-[#CFD0D4]`} style={{ backgroundColor: bg, color: text }}>
                        <div className='flex items-center space-x-2'>
                            <Icon size={24} weight="duotone" style={{ color: iconColor }}/>
                            <span className='text-[14px] font-semibold'>{name}</span>
                        </div>

                        <div className='hidden md:block'>
                            <span>{update}</span>
                        </div>

                        <div className='hidden md:block justify-self-center text-[14px] font-semibold'>
                            <span>{percentage}</span>
                        </div>

                        <div className='col-span-2 grid grid-cols-2 gap-x-6'>
                            <div ref={targetRef} className='hidden'>
                                <DataTable columns={columns} data={requests}/>
                            </div>

                        </div>
                    </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div ref={targetRef}>
                                <DataTable columns={columns} data={req}/>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </div>
            </Accordion>
        </div>
    );
}

