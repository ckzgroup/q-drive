import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";

// ICONS
import {
    Icon,
    House,
    HardDrives,
    Files,
    CarProfile,
    Users,
    UserCircle,
    Gear,
    SignOut,
    SteeringWheel
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {DownloadCloud} from "lucide-react";

type SidebarProps = {
    showLinks: boolean;
    sidebarWidth: string;
};

type SidebarLink = {
    name: string;
    icon: Icon | any;
    path: string;
};

export const adminNavigationLinks: SidebarLink[] = [
    { name: 'Dashboard', icon: House, path: '/' },
    { name: 'Requests', icon: HardDrives, path: '/requests' },
    { name: 'Reports', icon: Files, path: '/reports' },
    { name: 'Vehicles', icon: CarProfile, path: '/vehicles' },
    { name: 'Drivers', icon: Users, path: '/drivers' },
    // { name: 'Tracking', icon: SteeringWheel, path: '/tracking' },
    { name: 'Profile', icon: UserCircle, path: '/profile' },
    { name: 'Settings', icon: Gear, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ showLinks, sidebarWidth }) => {
    const router = useRouter();
    const activeLink = usePathname();

    const { theme } = useTheme(); // Replace with your actual theme context hook

    const logoPath = theme === 'dark' ? '/images/logo-white.svg' : '/images/logo-dark.svg';

    const handleDownload = () => {
        const fileName = 'Qudrive-User-Guide.pdf'; // Name of the file to be downloaded
        const filePath = `/downloads/${fileName}`; // Path to the file in the public folder

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = filePath;
        link.setAttribute('download', fileName);

        // Simulate click on the link to start download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    return (
        <div className={`bg-primary-foreground relative ${sidebarWidth} hidden md:block `}>
            <ScrollArea className="h-screen border-r">
                <div className="flex flex-col items-start justify-center my-4 px-6">
                    <div className='flex space-x-4 items-center'>
                        <Image src='/images/logo.svg' alt='logo' height={44} width={44} style={{ objectFit: "cover" }} />
                        {showLinks &&
                            <h1 className={cn("text-2xl font-bold")}> Qudrive  </h1>
                        }
                    </div>
                </div>
                <div className="p-4">
                    <ul className="space-y-2">
                        {adminNavigationLinks.map(({ name, icon: Icon, path }, index) => {
                            const isActiveLink = path === '/' ? activeLink === path : activeLink.startsWith(path);

                            const listItemClassName = `flex items-center text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer ${
                                isActiveLink ? 'bg-primary font-semibold text-primary-foreground hover:bg-primary/95' : 'hover:bg-secondary'
                            } `;

                            return (
                                <li key={index}>
                                    <Link href={path} className={listItemClassName}>
                                        <Icon size={24} weight="duotone"/>
                                        {showLinks && <span>{name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>


                </div>
                <div>
                    <ul className="space-y-2 px-4">
                                <li >
                                    <Link href='' className='flex items-center hover:bg-secondary text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer '>
                                        <SignOut size={24} weight="duotone"/>
                                        {showLinks && <span>Logout</span>}
                                    </Link>
                                </li>
                    </ul>
                </div>

                <div className="my-8 px-4">
                    <Button onClick={handleDownload} variant="outline" className="w-full space-x-4 border-red-500/20">
                        <DownloadCloud className="h-4 w-4"/>
                        {showLinks && <span>Download Guide</span> }
                    </Button>
                </div>
            </ScrollArea>

        </div>
    );
};

export default Sidebar;
