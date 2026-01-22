import { GasPump, Users, Money, Wrench, Toolbox, MagnifyingGlass, Calendar } from "@phosphor-icons/react"


export const statuses = [
    {
        value: "pending",
        label: "pending",
    },
    {
        value: "in-progress",
        label: "in-progress",
    },
    {
        value: "in-progress review",
        label: "in-progress review",
    },
    {
        value: "completed",
        label: "completed",
    },
    {
        value: "cancelled",
        label: "cancelled",
    },

]

export const types = [
    {
        label: "Fuel Refill",
        value: "Fuel Refill",
        icon: GasPump,
    },
    {
        label: "Casual Labourers",
        value: "Casual Labourers",
        icon: Users,
    },
    {
        label: "Petty Cash",
        value: "Petty Cash",
        icon: Money,
    },

    {
        label: "Vehicle Support",
        value: "Vehicle Support",
        icon: Wrench,
    },

    {
        label: "Vehicle Inspection",
        value: "Vehicle Inspection",
        icon: MagnifyingGlass,
    },

    {
        label: "Leave Application",
        value: "Leave Application",
        icon: Calendar,
    },
]