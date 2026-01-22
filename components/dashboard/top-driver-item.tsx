import React from 'react';
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface TopDriverItemProps {
    image: string;
    name: string;
    title: string;
}

export default function TopDriverItem({ image, name, title }: TopDriverItemProps) {
    return (
        <div className='flex items-center space-x-4'>
            <Avatar className={cn("h-10 w-10 border-[1.5px] border-primary/60")} role={"avatar"}>
                <AvatarImage
                    alt='avatar'
                    src={image}
                    className='object-cover'
                />
                <AvatarFallback></AvatarFallback>
            </Avatar>

            <div className='flex flex-col space-y-1'>
                <h2 className='font-bold'>{name}</h2>
                <span className='text-sm text-muted-foreground'>{title}</span>
            </div>
        </div>
    );
}

