
import { Metadata } from "next"
import Link from "next/link"

import {buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import {ModeToggle} from "@/components/lib/mode-toggle";
import {cn} from "@/lib/utils";
import {UserAuthForm} from "@/components/lib/forms/user-auth-form";
import React from "react";
import Loading from "@/app/(admin)/loading";

export const metadata: Metadata = {
    title: "Qudrive - Login",
    description: "Sign in to access Qudrive Fleet Management System",
}

export default function RegisterPage() {
    return (
        <>


            <div className='w-full relative'>
               <Link
                    href="/login"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    Login
                </Link>

                <div className="absolute bg-white dark:bg-black rounded-md right-4 top-4 md:right-8 md:top-8 z-20">
                    <ModeToggle/>
                </div>
            </div>

            <div
                className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="lg:p-8 ">
                    <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                           <div
                                className=' z-0 mx-auto h-48 w-48 left-[20%] md:h-56 md:w-56 absolute -top-[6%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-primary to-primary/20 rounded-full blur-3xl opacity-40 dark:opacity-20'></div>

                           <div className="flex flex-col space-y-2  z-10">
                               <div className='relative flex space-x-3 mb-12 items-center'>
                                   <Image src='/images/logo.svg' alt='logo' height={48} width={48}
                                          style={{objectFit: "cover"}}/>
                                   <h1 className={cn("text-2xl font-bold")}> Qudrive </h1>
                               </div>

                               <h1 className='text-2xl font-light'>Welcome back! </h1>

                               <h3 className="text-xl font-heading font-bold tracking-tight">
                                   Please Sign in to Continue.
                               </h3>
                               <p className="text-sm text-muted-foreground">
                                   Enter your credentials to access the admin panel.
                               </p>
                           </div>

                           {/* USER AUTH FORM */}
                           <UserAuthForm className='z-10'/>

                           <p className="px-8 text-center text-sm text-muted-foreground">
                               By clicking sign in, you agree to our{" "}
                               <Link
                                   href="#"
                                   className="hover:text-brand underline underline-offset-4"
                               >
                                   Terms of Service
                               </Link>{" "}
                               and{" "}
                               <Link
                                   href="#"
                                   className="hover:text-brand underline underline-offset-4"
                               >
                                   Privacy Policy
                               </Link>
                               .
                           </p>
                       </div>
                   </div>

                   <div className="z-0 relative hidden h-full bg-[#F5F5F5] lg:block">
                       <div className='relative h-64 w-full mt-24'>
                           <Image src='/images/login-header.svg' alt='qudrive-illustration' fill style={{ objectFit: "contain" }} />
                       </div>

                       <div className='text-center space-y-4'>
                           <h2 className='mt-12 text-2xl pl-24 pr-24 font-heading font-medium'>
                               Your Gateway to Streamlined Fleet Management!
                           </h2>
                           <p className='text-[#575C6F] text-base w-[70%] mx-auto'>
                               Effortless fleet management at your fingertips. Add vehicles, assign drivers, and drive efficiency. QuDrive - Where simplicity meets control.
                           </p>
                       </div>

                   </div>

            </div>
        </>
    )
}
