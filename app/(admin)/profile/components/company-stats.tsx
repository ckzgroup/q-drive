"use client";
import React from 'react';

import { CarProfile, Users } from "@phosphor-icons/react"
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import CompanyStatsCard from "@/app/(admin)/profile/components/company-stats-card";
import Link from "next/link";
import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";


function CompanyStats() {

    // GET CURRENT COMPANY ID
    const companyId = useAuthStore((state) => state.getCompanyId());

    // FETCH DRIVERS
    const { data: drivers, error: d_error } = useQuery({
        queryKey: ['driverData', companyId],
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

    // FETCH VEHICLES
    const { data: vehicles, error: v_error } = useQuery({
        queryKey: ['vehicleData', companyId],
        queryFn: async () => {
            const URL_TRUE = `${process.env.NEXT_PUBLIC_API_URL}/view_vehicle.php?company_id=${companyId}&status=true`;
            const URL_FALSE = `${process.env.NEXT_PUBLIC_API_URL}/view_vehicle.php?company_id=${companyId}&status=false`;

            const resTrue = await fetch(URL_TRUE);
            const resFalse = await fetch(URL_FALSE);

            if (!resTrue.ok || !resFalse.ok) {
                throw new Error(`Failed to fetch vehicles: ${!resTrue.ok ? resTrue.statusText : resFalse.statusText}`);
            }

            const dataTrue = await resTrue.json();
            const dataFalse = await resFalse.json();

            // Assuming your API response has a structure like { detailslist: [...] }
            const vehiclesTrue = dataTrue.detailslist || [];
            const vehiclesFalse = dataFalse.detailslist || [];

            return [...vehiclesTrue, ...vehiclesFalse];

        }});

    // RETURN DATA
    const combinedVehicles = Array.isArray(vehicles) ? vehicles.reverse() : [];
    const combinedDrivers = Array.isArray(drivers) ? drivers.reverse() : [];

    // GET TOTAL COMPANY STATS
    const totalVehicles = combinedVehicles.length;
    const totalDrivers = combinedDrivers.length;

    return (
        <div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-6'>
            <div className='col-span-3 space-y-4'>
                <h2 className='font-mono text-base'>Company Stats</h2>
                <div className='grid grid-cols-2 gap-6'>
                    {totalVehicles ? (
                    <CompanyStatsCard
                        name='Vehicles'
                        total={totalVehicles}
                        icon={CarProfile}
                        percentage="Total Vehicles"
                        bgColor='#9932CC'
                    />
                    ) : (
                        <Skeleton className="h-44 w-full rounded-md" />
                    )}

                    {totalDrivers ? (
                    <CompanyStatsCard
                        name='Drivers'
                        total={totalDrivers}
                        icon={Users}
                        percentage="Total Drivers"
                        bgColor='#079B92'
                    />
                    ) : (
                        <Skeleton className="h-44 w-full rounded-md" />
                    )}
                </div>
            </div>


                <div className='space-y-4'>
                    <h2 className='font-mono text-base'>Actions</h2>

                   <div className="flex flex-col space-y-4">
                       <Link href='/vehicles/new-vehicle'>
                           <Button className='space-x-1 bg-[#9932CC] hover:bg-[#9932CC]/90 border border-black/50' size='lg'>
                               <Plus className='h-5 w-5'/>
                               <span>Add Vehicle</span>
                           </Button>
                       </Link>

                       <Link href='/drivers/new-driver'>
                           <Button className='space-x-1 bg-[#079B92] hover:bg-[#079B92]/90 border border-black/50' size='lg'>
                               <Plus className='h-5 w-5'/>
                               <span>Add Driver</span>
                           </Button>
                       </Link>
                   </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyStats;