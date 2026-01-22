import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const driverSchema = z.object({
    user_id: z.string().optional(),
    user_name: z.string(),
    user_email: z.string(),
    role: z.string(),
    driver_license: z.string(),
    user_contact: z.string(),
    user_id_number: z.string(),
    user_profile: z.string().optional(),
    user_status: z.string()
})

export type Driver = z.infer<typeof driverSchema>