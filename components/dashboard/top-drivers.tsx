import React from 'react';
import TopDriverItem from "@/components/dashboard/top-driver-item";

const data = [
    {
        "name": "David Kimani",
        "image": "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "specialization": "Nairobi, Kenya"
    },
    {
        "name": "Brian Kiprop",
        "image": "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "specialization": "Nairobi, Kenya"
    },
    {
        "name": "Joseph Kamau",
        "image": "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "specialization": "Nairobi, Kenya"
    },
    {
        "name": "Lorna Nyambura",
        "image": "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "specialization": "Nairobi, Kenya"
    },
]


export default function TopDrivers() {
    return (
        <div className='flex flex-col space-y-4'>
            {data.map((doctor) => (
                <TopDriverItem
                    key={doctor.name}
                    image={doctor.image}
                    name={doctor.name}
                    title={doctor.specialization}
                />
            ))}
        </div>
    );
}

