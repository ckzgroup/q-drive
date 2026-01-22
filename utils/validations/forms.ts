import * as z from "zod"

// Driver Schema
export const driverSchema = z.object({
    company_id: z.string(),
    user_name: z.string().nonempty(),
    dob: z.string().nonempty(),
    user_role: z.string().nonempty(),
    user_email: z.string().nonempty(),
    password: z.string().nonempty(),
    id_number: z.string().nonempty(),
    gender: z.string().nonempty(),
    user_contact: z.string().min(8),
    driver_license: z.string().min(0),
    license_class: z.string().min(0),
    emergency_name: z.string().nonempty(),
    emergency_relation: z.string().nonempty(),
    emergency_contact: z.string().min(8),
})


// Vehicle Schema
export const vehicleSchema = z.object({
    company_id: z.string().nonempty(),
    vehicle_type: z.string().nonempty(),
    vehicle_make: z.string().nonempty(),
    vehicle_model: z.string().nonempty(),
    chassis: z.string().nonempty(),
    vehicle_plate: z.string().nonempty(),
    mileage: z.string().nonempty(),
    insurance_name: z.string().nonempty().optional(),
    insurance_policy_no: z.string().nonempty().optional(),
    insurance_expiry_date: z.date({
        required_error: "Insurance Expiry Date is required.",
    }).optional(),
    fuel_type: z.string().nonempty().optional(),
    fuel_efficiency: z.string().nonempty().optional(),
    fuel_capacity: z.string().nonempty().optional(),
    last_service_date: z.date({
        required_error: "Last Service Date is required.",
    }).optional(),
    next_service_date: z.date({
        required_error: "Next Service Date is required.",
    }).optional(),
})


// Profile Schema
export const profileSchema = z.object({
    name: z.string().nonempty(),
    url: z.string(),
    slogan: z.string().optional(),
    description: z.string().optional(),
    profile: z.string().optional()
})


// Profile Schema
export const passwordSchema = z.object({
    old_password: z.string().min(2),
    new_password: z.string().min(2),
    confirm_new_password: z.string().min(2),
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"], // path of error
});



// ----------------------------------------------------------------------------------
//---------------------   REQUEST CONFIRMATION FORMS --------------------------------
// ----------------------------------------------------------------------------------

export const leaveApplicationSchema = z.object({
    leave_type: z.string().nonempty(),
    leave_start_date: z.date(),
    leave_end_date: z.date(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string(),
    request_id: z.string(),
    request_type: z.string(),
})

export const fuelRefillSchema = z.object({
    fueling_reason: z.string().nonempty(),
    request_date: z.date(),
    fuel_amount: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string(),
    request_id: z.string(),
    request_type: z.string(),
});

export const vehicleSupportSchema = z.object({
    support_type: z.string().nonempty(),
    request_date: z.date(),
    support_cost: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});

export const pettyCashSchema = z.object({
    allowance_type: z.string().nonempty(),
    start_date: z.date(),
    total_days: z.string(),
    allowance_amount: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});

export const casualLabourersSchema = z.object({
    work_type: z.string().nonempty(),
    start_date: z.date(),
    total_days: z.string(),
    casual_amount: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});

export const vehicleInspectionSchema = z.object({
    inspection_type: z.string().nonempty(),
    inspection_date: z.date(),
    inspection_cost: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});