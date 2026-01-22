"use client";

import React, {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import { CheckCircle2, RefreshCcw, Users, PieChart } from "lucide-react";
import RequestCard from "@/components/dashboard/request-card";
import BarMain from "@/components/elements/charts/bar";
import DonutChart from "@/components/elements/charts/donut-chart";
import {DataTable} from "@/components/tables/requests/data-table";
import {columns} from "@/components/tables/requests/column";
import {useQuery} from "@tanstack/react-query";
import useAuthStore from "@/hooks/use-user";

import Link from "next/link";
import CashCard from "@/components/dashboard/cash-card";
import useTotalAmount from "@/hooks/use-total-amount";
import dynamic from "next/dynamic";



// const LazyMap = dynamic(() => import("@/components/Map"), {
//     ssr: false,
//     loading: () => <p>Loading...</p>,
// });

interface Request {
    request_type: string;
    request_date: string;
    user_name: string;
    amount: string;
    status: string;
    fueled_liters: string;
}

export default function  Dashboard() {
    const companyId = useAuthStore((state) => state.getCompanyId());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [weekly, setWeekly] = useState(false);
    const [week, setWeek] = useState(1); // Add state for selected week


    const URL=`${process.env.NEXT_PUBLIC_API_URL}/company_request.php?company_id=${companyId}&request_status=all`;


    const { isPending: pettyCashPending, error: pettyCashError, data: pettyCashData } = useQuery({
        queryKey: ['pettyCash', companyId],
        queryFn: async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/company_cost.php?company_id=${companyId}&title=fuel refill`
                );
                if (!res.ok) {
                    throw new Error('Failed to fetch petty cash data');
                }
                const data = await res.json();

                // Extract the `detailslist` array
                const requests = data.total || '';

                return requests;
            } catch (error) {
                console.error('Error fetching petty cash data:', error);
                throw error; // Re-throw to allow useQuery to handle it
            }
        },
    });

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData', companyId],
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

    // Filter requests based on request status
    const totalRequestsLength = requests.length;
    const cancelledRequests = requests.filter((request: Request) => request.status === 'cancelled').length;
    const inProgressRequests = requests.filter((request: Request) => request.status === 'in-progress').length;
    const inProgressReviewRequests = requests.filter((request: Request) => request.status === 'in-progress review').length;
    const completedRequests = requests.filter((request: Request) => request.status === 'completed').length;

    // Calculate percentages with two decimal places
    const cancelledPercentage = totalRequestsLength > 0 ? ((cancelledRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const inProgressPercentage = totalRequestsLength > 0 ? ((inProgressRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const inProgressReviewPercentage = totalRequestsLength > 0 ? ((inProgressReviewRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';
    const completedPercentage = totalRequestsLength > 0 ? ((completedRequests / totalRequestsLength) * 100).toFixed(2) : '0.00';

    const [isClient, setIsClient] = useState(false)

    const { user, isAuthenticated, logout } = useAuthStore();

    // TOTAL AMOUNT
    const { isPending: amontPending, error: amountError, data: fuelAmount } = useTotalAmount( "fuel refill", companyId, month, year);
    const { isPending: cPending, error: cError, data: casualAmount } = useTotalAmount( "casual labourers", companyId, month, year);
    const { isPending: pPending, error: pError, data: pettyAmount } = useTotalAmount( "petty cash", companyId, month, year);
    const { isPending: sPending, error: sError, data: supportAmount } = useTotalAmount( "vehicle support", companyId, month, year);
    const { isPending: iPending, error: iError, data: inspectionAmount } = useTotalAmount( "vehicle inspection", companyId, month, year);



    useEffect(() => {
        setIsClient(true)
    }, []);

    const filterRequests = (requests: Request[], month: number, year: number, weekly: boolean, week: number) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        if (weekly) {
            const startOfWeek = new Date(startDate);
            startOfWeek.setDate((week - 1) * 7 + 1);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            return requests.filter(request => {
                const requestDate = new Date(request.request_date);
                return requestDate >= startOfWeek && requestDate <= endOfWeek;
            });
        } else {
            return requests.filter(request => {
                const requestDate = new Date(request.request_date);
                return requestDate >= startDate && requestDate <= endDate;
            });
        }
    };

    const filteredRequests = useMemo(() => filterRequests(requests, month, year, weekly, week), [requests, month, year, weekly, week]);

    const formatAmount = (fueled_liters: number) => ` ${fueled_liters.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const calculateTotal = (type: string) => {
        return filteredRequests
            .filter(request => request.request_type === type)
            .reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);
    };

    const fuelTotal = formatAmount(calculateTotal('Fuel Refill'));
    const casualTotal = formatAmount(calculateTotal('Casual Labourers'));
    const pettyTotal = formatAmount(calculateTotal('Petty Cash'));
    const supportTotal = formatAmount(calculateTotal('Vehicle Support'));
    const inspectionTotal = formatAmount(calculateTotal('Inspection'));


    // REQUESTS TABLE
    const URL_Main = `${process.env.NEXT_PUBLIC_API_URL}/all_company_request.php?company_id=${companyId}`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isPending:isLoading, error:all_error, data:all_data } = useQuery({
        queryKey: ['requestDetails', companyId],
        queryFn: async () => {
            try {
                const res = await fetch(URL_Main);
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



    const allRequests = Array.isArray(all_data) ? all_data.reverse() : [];

    return (
        <div>
          <div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
              <div className='col-span-3 space-y-6'>
                {/* HEADER */}
                <div className='flex justify-between'>
                  <div>
                    <h1 className='text-2xl font-bold'>Welcome, {isClient ? user?.name : ''}</h1>
                    <p className='text-muted-foreground'>New updates found</p>
                  </div>
                  <Button className='space-x-2'>
                    <span>Refresh</span>
                    <RefreshCcw size={16}/>
                  </Button>
                </div>


                {/*  REQUEST CARDS  */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                  <Link href='/requests'>
                    <RequestCard
                      name={'All Requests'}
                      total={totalRequestsLength}
                      icon={CheckCircle2}
                      percentage={100}
                      bgColor={'#FFFFFF'}
                      border={"#0E1428"}
                    />
                  </Link>
                  <Link href='/requests'>
                    <RequestCard
                      name={'In Progress'}
                      total={inProgressRequests}
                      icon={CheckCircle2}
                      percentage={inProgressPercentage}
                      bgColor={'#FFEA79'}
                      border={''}
                    />
                  </Link>

                  <Link href='/requests'>
                    <RequestCard
                      name={'In-Progress Review'}
                      total={inProgressReviewRequests}
                      icon={CheckCircle2}
                      percentage={inProgressReviewPercentage}
                      bgColor={'#FFC458'}
                      border={''}
                    />
                  </Link>

                  <Link href='/requests'>
                    <RequestCard
                      name={'Cancelled'}
                      total={cancelledRequests}
                      icon={CheckCircle2}
                      percentage={cancelledPercentage}
                      bgColor={'#FF9DA8'}
                      border={''}
                    />
                  </Link>

                  <Link href='/requests'>
                    <RequestCard
                      name={'Completed'}
                      total={completedRequests}
                      icon={CheckCircle2}
                      percentage={completedPercentage}
                      bgColor={'#55BA6A'}
                      border={''}
                    />
                  </Link>
                </div>

                {/*  TOTAL REQUEST AMOUNT  */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <p className="font-semibold">Amount Total </p>

                    <div className="flex justify-end space-x-4 mb-4">
                      <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                        {Array.from({length: 12}, (_, index) => {
                          const monthNumber = index + 1;
                          return (
                            <option key={monthNumber} value={monthNumber}>
                              {new Date(0, index).toLocaleString('default', {month: 'long'})}
                            </option>
                          );
                        })}
                      </select>
                      <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                        {Array.from({length: 10}, (_, index) => {
                          const currentYear = new Date().getFullYear();
                          const yearValue = currentYear - index;
                          return (
                            <option key={yearValue} value={yearValue}>
                              {yearValue}
                            </option>
                          );
                        })}
                      </select>
                      {weekly && (
                        <select value={week} onChange={(e) => setWeek(parseInt(e.target.value))}>
                          <option value={1}>Week 1</option>
                          <option value={2}>Week 2</option>
                          <option value={3}>Week 3</option>
                          <option value={4}>Week 4</option>
                        </select>
                      )}
                      <Button onClick={() => setWeekly(!weekly)} className="space-x-2">
                        <span>{weekly ? 'Show Monthly' : 'Show Weekly'}</span>
                      </Button>
                    </div>


                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                    <CashCard
                      name={'Fuel Refill'}
                      total={fuelTotal}
                      icon={CheckCircle2}
                      bgColor={'#F8FAFC'}
                      border={"#32CD32"}
                    />
                    <CashCard
                      name={'Casual Labourers'}
                      total={casualTotal}
                      icon={CheckCircle2}
                      bgColor={'#F8FAFC'}
                      border={'#FF4500'}
                    />
                    <CashCard
                      name={'Petty Cash'}
                      total={pettyTotal}
                      icon={CheckCircle2}
                      bgColor={'#F8FAFC'}
                      border={'#FFD700'}
                    />
                    <CashCard
                      name={'Vehicle Support'}
                      total={supportTotal}
                      icon={CheckCircle2}
                      bgColor={'#F8FAFC'}
                      border={'#4169E1'}
                    />
                    <CashCard
                      name={'Inspection'}
                      total={inspectionTotal}
                      icon={CheckCircle2}
                      bgColor={'#F8FAFC'}
                      border={'#FF6347'}
                    />
                  </div>
                </div>

              </div>
              <div className='col-span-1 space-y-12'>
                <div>
                  <div className='flex items-center space-x-2 mb-8'>
                    <div className='bg-secondary p-1 rounded-md'>
                      <PieChart className='h-4 w-4 text-primary'/>
                    </div>
                    <span className='font-semibold'>Activities</span>
                  </div>
                  {/* Donut Chart */}
                  <div className="flex">
                    <DonutChart/>
                  </div>
                </div>

                {/*<div>*/}
                {/*    <div className='flex items-center space-x-2 mb-8'>*/}
                {/*        <div className='bg-secondary p-1 rounded-md'>*/}
                {/*            <Users className='h-4 w-4 text-primary'/>*/}
                {/*        </div>*/}
                {/*        <span className='font-semibold'>Top Drivers</span>*/}
                {/*    </div>*/}
                {/*    <TopDrivers/>*/}
                {/*</div>*/}

              </div>
            </div>

            {/* Bar Chart */}
            <div className="w-full mt-8">
              <div className='flex items-center space-x-2 mb-8'>
                <span className='font-semibold'>Overall Requests</span>
              </div>
              <BarMain requests={requests}/>
            </div>
            {/* Requests Table */}
            <div className="col-span-4 mt-16">
              <div className='flex items-center space-x-2 mb-8'>
                <span className='text-lg font-bold'>Recent Requests</span>
              </div>
              <DataTable columns={columns} data={allRequests}/>
            </div>

            {/*<WialonIntegration/>*/}
            {/*<LazyMap position={[51.505, -0.09]}/>*/}
          </div>
        </div>
    );
}

