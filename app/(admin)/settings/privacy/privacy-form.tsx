"use client"

import * as z from "zod";
import axios from "axios";
import {useRouter} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import useAuthStore from "@/hooks/use-user";
import * as React from "react";
import { passwordSchema } from "@/utils/validations/forms";
import {Icons} from "@/components/ui/icons";

type FormData = z.infer<typeof passwordSchema>

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

export function PrivacyForm() {

    const authStore = useAuthStore();
    const user: User | null = authStore.user;


    const form = useForm<FormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            // confirm_new_password: "",
        }
    });


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


            const response = await axios.post(`${apiUrl}/update_password.php?old_password=${form.getValues('old_password')}&new_password=${form.getValues('new_password')}&user_id=${companyId}&role=company`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                insecureHTTPParser: true,
                httpsAgent: httpsAgent
            });
            // const password = response.data["message"];
            if (response.status === 200) {

                router.refresh();
                toast({
                    title: "Password updated!",
                    description: "You have successfully updated your company password.",
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


    return (
        <>
            {user && (
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="old_password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Current Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter current password" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="new_password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter new password" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-1">
                                <FormField
                                    control={form.control}
                                    name="confirm_new_password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password"
                                                       placeholder="Enter new password again" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
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
