import * as z from "zod"

export const userAuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});

export const userRegisterSchema = z.object({
    email: z.string().email(),
    role: z.string(),
    company_name: z.string().min(1,{
    message: "Company name is required"
}),
    phone_number: z.string().min(1, {
        message: "Phone number is required"
    }),
    password: z.string().min(6, {
        message: "Password must contain at least 6 character(s)"
    }),
})
