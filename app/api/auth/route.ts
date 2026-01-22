import { NextResponse } from 'next/server';
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();

        const { email, company_name, phone_number, role, password } = body;

        const hashedPassword = await bcrypt.hash(password, 10);


        if (!email) {
            return new NextResponse("Email is required", { status: 400 });
        }

        if (!company_name) {
            return new NextResponse("Company name is required", { status: 400 });
        }

        if (!phone_number) {
            return new NextResponse("Phone number is required", { status: 400 });
        }

        if (!role) {
            return new NextResponse("Role is required", { status: 400 });
        }

        if (!password) {
            return new NextResponse("Password is required", { status: 400 });
        }

        const sql =
            'INSERT INTO `company_registration`(`email`, `company_name`, `phone_number`, `role`, `password`) VALUES (email, company_name, phone_number, role, password)';

        const [result, fields] = await db.query({
            sql,
            // ... other options
        });

        return NextResponse.json(result);

    } catch (error) {
        console.log('[REGISTRATION_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}