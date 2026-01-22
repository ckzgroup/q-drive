import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const vehicleSchema = z.object({
    vehicle_type: z.string(),
    vehicle_make: z.string(),
    vehicle_model: z.string(),
    vehicle_plate: z.string(),
    chassis: z.string(),
    mileage: z.string(),
    vehicle_status: z.string(),
})

export type Vehicle = z.infer<typeof vehicleSchema>