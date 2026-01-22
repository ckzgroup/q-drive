"use client"

import React from 'react';
import getRequests from "@/actions/get-requests";
import RequestCard from "@/components/dashboard/request-card";
import {CheckCircle2} from "lucide-react";

interface Request {
    request_type: string;
    request_date: string;
    user_name: string;
    status: string;
}

async function RequestCards() {

    const data = await getRequests()

    // Filter requests based on request_type
    const totalRequestsLength = data.length;
    const cancelledRequests = data.filter((request: Request) => request.request_type === 'cancelled').length;
    const inProgressRequests = data.filter((request: Request) => request.request_type === 'in-progress').length;
    const pendingRequests = data.filter((request: Request) => request.request_type === 'pending').length;
    const completedRequests = data.filter((request: Request) => request.request_type === 'completed').length;


    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <RequestCard
                name={'All Requests'}
                total={totalRequestsLength}
                icon={CheckCircle2}
                percentage={100}
                bgColor={'#FFFFFF'}
                border={"#0E1428"}
            />
            <RequestCard
                name={'In Progress'}
                total={inProgressRequests}
                icon={CheckCircle2}
                percentage={30}
                bgColor={'#FFC458'}
                border={''}
            />
            <RequestCard
                name={'Cancelled'}
                total={cancelledRequests}
                icon={CheckCircle2}
                percentage={24}
                bgColor={'#FF9DA8'}
                border={''}
            />
            <RequestCard
                name={'Completed'}
                total={completedRequests}
                icon={CheckCircle2}
                percentage={46}
                bgColor={'#55BA6A'}
                border={''}
            />
        </div>

    );
}

export default RequestCards;