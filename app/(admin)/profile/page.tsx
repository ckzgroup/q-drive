"use client";

import React from 'react';
import Header from "@/app/(admin)/profile/components/header";
import CompanyDetails from "@/app/(admin)/profile/components/company-details";
import CompanyStats from "@/app/(admin)/profile/components/company-stats";

export default function Profile() {
    return (
        <div>
            <Header/>
            <CompanyDetails/>
            <CompanyStats/>
        </div>
    );
}
