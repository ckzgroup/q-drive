"use client";

import React, {useEffect, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

import { SealCheck, Link as LinkIcon } from "@phosphor-icons/react"
import Link from "next/link";
import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import Loading from "@/app/(admin)/loading";
import {useQuery} from "@tanstack/react-query";
function CompanyDetails() {

    const [isClient, setIsClient] = useState(false)

    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore((state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
    }));


    useEffect(() => {
        setIsClient(true)
    }, []);

    // Get Avatar Initials
    const getInitials = (name:string | undefined) => {
        // Split the name into words
        const words = name?.split(' ');

        // Get the first letter of each word
        const initials = words?.map(word => word[0]);

        // Join the initials into a string
        return initials?.join('');
    };

    const userName = user?.name;
    const userInitials = getInitials(userName);



    return (
        <>
            {isClient ? (
        <div className='my-14'>
            <div className='relative w-fit'>
                <Avatar className={cn("h-28 w-28 border-[1.5px] border-primary/10")} role={"menuitem"}>
                    <AvatarImage
                        alt='avatar'
                        src={user?.profile}
                        className='object-cover'
                    />
                    <AvatarFallback className="bg-[#ebd6f5] dark:bg-[#2e0f3d] text-2xl">{isClient ? userInitials : ''}</AvatarFallback>
                </Avatar>
                <SealCheck size={34} weight="fill" className='absolute -bottom-0 -right-0'/>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-6'>
                <div className='col-span-3 space-y-4'>
                    <h1 className='text-4xl font-bold'>{ user?.name }</h1>
                    <h4 className='text-xl '>{user?.slogan}</h4>
                    <p className='text-base text-muted-foreground'>
                        {user?.description}
                    </p>
                </div>
                <div>
                    {user?.url && (
                    <Link target='_blank' href={`${user?.url}`} className='flex items-center space-x-2 transition duration-300 hover:text-primary' >
                        <LinkIcon size={20} weight="bold" />
                        <span className='text-base font-semibold'>{user?.url}</span>
                    </Link>
                    )}
                </div>
            </div>
        </div>
                ) :
                (<Loading />)
            }
        </>
    );
}

export default CompanyDetails;