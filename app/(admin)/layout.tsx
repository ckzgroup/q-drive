"use client"
import React, {useEffect, useState} from "react";
import Layout from "@/components/layout";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import {boolean} from "zod";
import Loading from "@/app/(admin)/loading";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; //

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const queryClient = new QueryClient()
    const [isClient, setIsClient] = useState(false)


    useEffect(() => {
        setIsClient(true);
        // Redirect to login page if not logged in
        if (!isAuthenticated) {
            router.push('/login'); // Adjust the login page URL as needed
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        // Render your dashboard or main content here
        return <Loading/>;
    }

    
    return (
        <main>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    {isClient ?
                    children
                        : null }
                </Layout>
            </QueryClientProvider>
        </main>
)
}
