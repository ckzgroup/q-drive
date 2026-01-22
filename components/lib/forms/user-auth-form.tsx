"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { userAuthSchema } from "@/utils/validations/auth";
import { Icons } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

import { SignIn } from "@phosphor-icons/react"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import axios from "axios";
import useAuthStore from "@/hooks/use-user";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(userAuthSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const authStore = useAuthStore();
    const router = useRouter();


    async function onSubmit(data: FormData) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const corsProxyUrl = "https://corsproxy.io/?";

        try {
            const https = require('http');
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });
            const response = await axios.post(`${apiUrl}/login.php?email=${form.getValues('email')}&password=${form.getValues('password')}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                insecureHTTPParser: true,
                 httpsAgent: httpsAgent

            });
            if (response.status === 200) {
               const user = response.data; // Assuming the API returns user information on success
                authStore.login(user); // Store user in the Zustand store

                if (form.getValues('email') && user.email) {
                    // Authentication successful
                    router.push("/");
                    toast({
                        title: "Welcome Back!",
                        description: "You have successfully logged in.",
                    });
                } else {
                    // Authentication failed, show specific error message from the API
                    toast({
                        title: "Error",
                        description: user.message || "Invalid credentials. Please enter valid email and password.",
                        variant: "destructive"
                    });
                }
            } else {
                // Handle other HTTP status codes
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.log(error, "An unexpected error occurred. Please try again later.")
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
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email address" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='my-4 flex justify-between items-center'>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember"/>
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember Me
                            </label>
                        </div>

                        <div>
                            <Link href='#' className='text-primary underline font-medium'>
                                Forgot Password
                            </Link>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className= "space-x-2 mt-4"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        <span>Log in</span>
                        <SignIn size={20} weight="duotone"/>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                        </div>
                    </div>
                </div>
            </form>
            </Form>

        </div>
    )
}