import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const requestSchema = z.object({
    request_id: z.string(),
    request_type: z.string(),
    request_date: z.string(),
    user_name: z.string(),
    status: z.string(),
})

export type Request = z.infer<typeof requestSchema>