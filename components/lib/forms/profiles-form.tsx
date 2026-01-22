"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"


import {Button, buttonVariants} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/ui/icons";
import {driverSchema, profileSchema} from "@/utils/validations/forms";
import {Textarea} from "@/components/ui/textarea";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {CloudArrowUp} from "@phosphor-icons/react";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import useAuthStore from "@/hooks/use-user";
import axios from "axios";
import * as fs from "fs";
import ImageUpload from "@/components/ui/image-upload.";


interface ProfileFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof profileSchema>

interface User {
    id: string;
    company_id: string;
    email: string;
    name: string;
    contact: string;
    profile: string;
    url: string;
    slogan: string;
    description: string;
    // Add other user details as needed
}

export function ProfileForm({ className, ...props }: ProfileFormProps) {

    const authStore = useAuthStore();
    const user: User | null = authStore.user;


    const form = useForm<FormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {     // @ts-ignore
            company_name: user?.name || "",
            profile: user?.profile || "",
            slogan: user?.slogan || "",
            url: user?.url || "",
            description: user?.description || "",
        }
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const companyId = useAuthStore((state) => state.getCompanyId());

    const router = useRouter();


    async function onSubmit(data: FormData, event: any) {

        try {
            setIsLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const https = require('http');
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });



            const response = await axios.patch(`${apiUrl}/update_company.php?email=${user?.email}&company_name=${user?.name}&phone_number=${user?.contact}&role=company&slogan=${form.getValues('slogan')}&url=${form.getValues('url')}&description=${form.getValues('description')}&profile=${form.getValues('profile')}&company_id=${companyId}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'PATCH',
                insecureHTTPParser: true,
                httpsAgent: httpsAgent
            });
            if (response.status === 200) {
                const profile = response.data;
                router.push("/profile");
                toast({
                    title: "Profile updated!",
                    description: "You have successfully updated company profile.",
                    variant: "success"
                });



            } else {
                // Handle other HTTP status codes
                setIsLoading(false);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }

    }

    // @ts-ignore
    return (
        <>
            {user && (
                <div className={cn("grid gap-6", className)} {...props}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div
                                className='relative h-56 w-full bg-muted-foreground/20 flex justify-center items-center'>
                                <div className='flex justify-center flex-col space-y-4 items-center'>
                                    <CloudArrowUp size={44} weight="duotone"/>
                                    <h4 className='font-semibold'>Click to upload or drag and drop</h4>
                                </div>
                            </div>

                            <div className='pb-12'>
                                <div className='mb-5 space-y-2 pt-12'>
                                    <h1 className='text-lg font-bold font-heading'> Public profile </h1>
                                    <p className='text-muted-foreground'> This will be displayed on your profile. </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-1">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Company Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={user?.name} {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <FormField
                                            control={form.control}
                                            name="url"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Website URL</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={user?.url} {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <FormField
                                            control={form.control}
                                            name="slogan"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Slogan</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={user?.slogan} {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Company Description</FormLabel>
                                                    <FormControl>
                                                        {/*@ts-ignore*/}
                                                        <Textarea rows={4} value={user?.description}
                                                                  placeholder="Enter company description" {...field} ></Textarea>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>
                            </div>

                            <hr/>

                            <div className='pt-12'>
                                <div className='mb-5 space-y-2'>
                                    <h1 className='text-lg font-bold font-heading'> Company Logo </h1>
                                    <p className='text-muted-foreground'>
                                        Update your company logo and then choose where you want it to be displayed. </p>
                                </div>

                                <div className='flex space-x-12'>

                                    <div className='relative'>
                                        <Image src={ user?.profile || ''} className='border border-primary rounded-full'
                                               alt='logo' height={140} width={140} style={{objectFit: "cover"}}/>
                                    </div>
                                    <div className='w-80 h-64'>
                                        <FormField
                                            control={form.control}
                                            name="profile"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ImageUpload
                                                            value={field.value ? [field.value] : []}
                                                            disabled={isLoading}
                                                            onChange={(url) => field.onChange(url)}
                                                            onRemove={() => field.onChange("")}
                                                        />
                                                        {/*<Input type="file" {...field}/>*/}
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div className='pt-12 space-x-4 flex justify-end'>
                                <Button type="reset" size='lg' variant='outline'>
                                    Cancel
                                </Button>

                                <Button type="submit" size='lg' disabled={isLoading}>
                                    {isLoading && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    )}
                                    Save changes
                                </Button>
                            </div>

                        </form>
                    </Form>

                </div>
            )}
        </>
    )
}
