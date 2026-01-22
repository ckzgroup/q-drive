"use client";
import React from 'react';

import { Icon } from "@phosphor-icons/react"

interface CompanyStatsCardProps {
    name: string;
    total: number | string;
    icon: Icon | any;
    percentage: number | string;
    bgColor: string;
}

function CompanyStatsCard({ name, icon: Icon, total, percentage, bgColor }: CompanyStatsCardProps) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 rounded-xl p-8 items-center text-white border-dashed border-2 border-white' style={{ backgroundColor: bgColor }}>
            <h3 className='text-lg font-medium'>{name}</h3>
            <Icon size={48} weight="duotone" className='justify-self-start sm:justify-self-end'/>
            <h1 className='text-3xl font-bold'>{total}</h1>
            <div className='justify-self-start sm:justify-self-end font-mono opacity-60'>
                <span>{percentage}</span>
            </div>
        </div>
    );
}

export default CompanyStatsCard;