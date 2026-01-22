import React from 'react';

import { Icon } from "@phosphor-icons/react"

interface CompanyStatsCardProps {
    name: string;
    total: any;
    icon: Icon | any;
    percentage?: number | string;
    bgColor: string;
    border: string;
}

export default function CashCard({ name, icon: Icon, total, percentage, bgColor, border }: CompanyStatsCardProps) {
    return (
        <div className='grid grid-cols-1 gap-6 md:gap-4 rounded-xl py-6 pl-6 md:p-4 items-center  text-[#0E1428] border-dashed border-[1.5px]' style={{ backgroundColor: bgColor, borderColor: border }}>
            <div className='flex justify-between items-center'>
                <h3 className=' font-semibold'>{name}</h3></div>
            <div className='relative'>
                <h1 className='text-lg font-bold '>Ksh {total}</h1>
            </div>
        </div>
    );
}

