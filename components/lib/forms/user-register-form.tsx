"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import bcrypt from 'bcryptjs';
import axios from "axios";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { userRegisterSchema } from "@/utils/validations/auth";
import {Icons} from "@/components/ui/icons";
import useAuthStore from "@/hooks/use-user";

import { SignIn } from "@phosphor-icons/react"

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userRegisterSchema>

export function UserRegisterForm({ className, ...props }: UserRegisterFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: {
            company_name: "",
            phone_number: "",
            email: "",
            password: "",
            role: "company"
        }
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const authStore = useAuthStore();
    const router = useRouter();


    async function onSubmit(data: FormData) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const corsProxyUrl = "https://proxy.cors.sh/";

        try {

            // Check if email or company name already exists in the database
            const checkResponse = await axios.get(`${apiUrl}/login.php?email=${form.getValues('email')}`);

            if (checkResponse.data.exists) {
                // Company with the provided email or company name already exists
                toast({
                    title: "Error",
                    description: "Company with the provided email or company name already exists.",
                    variant: "destructive",
                });
                return;
            }

            // Hash the password before sending it to the server
            const response = await axios.post(`${apiUrl}/company_registration.php?email=${form.getValues('email')}&company_name=${form.getValues('company_name')}&phone_number=${form.getValues('phone_number')}&role=company&password=${form.getValues('password')}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const user = response.data; // Assuming the API returns user information on success
                authStore.login(user); // Store user in the Zustand store
                router.push("/");

                toast({
                    title: "Account created!",
                    description: "You have successfully created your account.",
                });

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
                        name="company_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter company name" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter phone number" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

                    <Button
                        type="submit"
                        className= "space-x-2 mt-4"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        <span>Create account</span>
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