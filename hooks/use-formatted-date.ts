"use client";

// useFormattedDate.ts
import { useState, useEffect } from 'react';

const UseFormattedDate = (initialDate: string) => {
    const [formattedDate, setFormattedDate] = useState<string>('');

    useEffect(() => {
        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const day = date.getDate();
            const monthIndex = date.getMonth();
            const year = date.getFullYear();
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const getOrdinalSuffix = (day: number) => {
                if (day > 3 && day < 21) return "th";
                switch (day % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            };
            return `${months[monthIndex]} ${day}${getOrdinalSuffix(day)}, ${year}`;
        };

        setFormattedDate(formatDate(initialDate));
    }, [initialDate]);

    return formattedDate;
};

export default UseFormattedDate;
