"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import { PencilSimple } from "@phosphor-icons/react"
import Link from "next/link";

function Header() {
    return (
        <div className='relative h-56 w-full bg-no-repeat bg-center bg-cover bg-[url("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")]'>
            <Link href='/profile/edit-profile'>
            <Button className="bg-white text-[#0E1428] hover:bg-white/90 space-x-2 absolute top-4 right-4">
                <PencilSimple size={20} weight="duotone" />
                <span className='font-semibold'>Edit Profile</span>
            </Button>
            </Link>
        </div>
    );
}

export default Header;