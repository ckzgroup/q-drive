"use client";

import dynamic from "next/dynamic";
import {
    Bar,
    ResponsiveContainer,
    Tooltip,
    Legend,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import { useEffect, useState } from "react";

const BarChart = dynamic(() => import("recharts").then((recharts) => recharts.BarChart), {
    ssr: false,
});

interface Request {
    request_type: string;
    request_date: string;
    user_name: string;
    amount: string;
    status: string;
}

interface BarMainProps {
    requests: Request[];
}

export default function BarMain({ requests }: BarMainProps) {
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // @ts-ignore
                const years = [...new Set(requests.map((request) => new Date(request.request_date).getFullYear()))];

                const monthlyDataForYears = await Promise.all(
                    years.map(async (year) => {
                        const yearRequests = requests.filter(
                            (request) => new Date(request.request_date).getFullYear() === year
                        );

                        const monthlyRequests = Array.from({ length: 12 }, (_, index) => {
                            const month = index + 1;
                            const monthRequests = yearRequests.filter(
                                (request) => new Date(request.request_date).getMonth() === index
                            );

                            const totalFuelRequests = monthRequests.filter(
                                (request) => request.request_type === "Fuel Refill"
                            ).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                            const totalCashRequests = monthRequests.filter(
                                (request) => request.request_type === "Petty Cash"
                            ).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                            const totalSupportRequests = monthRequests.filter(
                                (request) => request.request_type === "Vehicle Support"
                            ).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                            const totalLabourersRequests = monthRequests.filter(
                                (request) => request.request_type === "Casual Labourers"
                            ).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                            const totalLeaveRequests = monthRequests.filter(
                                (request) => request.request_type === "Leave Application"
                            ).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                            const monthName = new Date(`${year}-${month}-01`).toLocaleDateString('en-US', { month: 'long' });

                            const totalAmount = monthRequests.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

                            return {
                                name: monthName,
                                fuel: totalFuelRequests,
                                pettyCash: totalCashRequests,
                                support: totalSupportRequests,
                                labourers: totalLabourersRequests,
                                leaveApplication: totalLeaveRequests,
                                amt: `Ksh ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            };
                        });

                        return { year, monthlyRequests };
                    })
                );
                // @ts-ignore
                setMonthlyData(monthlyDataForYears);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [requests]);

    const formatTooltip = (value: number) => `Ksh ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div>
            {monthlyData.map(({ year, monthlyRequests }) => (
                <div key={year}>
                    <h2>{`Year ${year}`}</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            width={500}
                            height={300}
                            data={monthlyRequests}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={formatTooltip} />
                            <Legend />
                            <Bar dataKey="fuel" stackId="a" fill="#FFD700" />
                            <Bar dataKey="pettyCash" stackId="a" fill="#32CD32" />
                            <Bar dataKey="support" stackId="a" fill="#4169E1" />
                            <Bar dataKey="labourers" stackId="a" fill="#FF4500" />
                            <Bar dataKey="leaveApplication" stackId="a" fill="#9932CC" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    );
}
