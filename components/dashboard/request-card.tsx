import React from 'react';

import { Icon } from "@phosphor-icons/react"

interface CompanyStatsCardProps {
    name: string;
    total: number | string;
    icon: Icon | any;
    percentage?: number | string;
    bgColor: string;
    border: string;
}

export default function RequestCard({ name, icon: Icon, total, percentage, bgColor, border }: CompanyStatsCardProps) {
    return (
        <div className='grid grid-cols-1 gap-6 md:gap-4 rounded-xl p-6 md:p-4 items-center  text-[#0E1428] border-dashed border-[1.5px]' style={{ backgroundColor: bgColor, borderColor: border }}>
            <div className='flex justify-between items-center'>
                <h3 className=' font-semibold'>{name}</h3>
                <Icon size={24} weight="duotone" className=''/>
            </div>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>{total}</h1>
                {percentage && (
                    <div className='justify-self-end'>
                        <span>+{percentage}%</span>
                    </div>
                )}

            </div>
        </div>
    );
}

