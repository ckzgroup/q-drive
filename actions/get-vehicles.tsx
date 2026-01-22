"use client";

import useAuthStore from "@/hooks/use-user";


const getVehicles = async (): Promise<any> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const companyId = useAuthStore((state) => state.getCompanyId());

    const URL_TRUE = `${process.env.NEXT_PUBLIC_API_URL}/view_vehicle.php?company_id=${companyId}&status=true`;
    const URL_FALSE = `${process.env.NEXT_PUBLIC_API_URL}/view_vehicle.php?company_id=${companyId}&status=false`;

    const res_true = await fetch(URL_TRUE);
    const res_false = await fetch(URL_FALSE);

    if (!res_true.ok || !res_false.ok) {
        throw new Error(`Failed to fetch requests: ${!res_true.ok ? res_true.statusText : res_false.statusText}`);
    }

    const data_true = await res_true.json();
    const data_false = await res_false.json();

    // Assuming your API response has a structure like { detailslist: [...] }
    const vehicles_true = data_true.detailslist || [];
    const vehicles_false = data_false.detailslist || [];

    const combinedVehicles = [...vehicles_true, ...vehicles_false];

    return combinedVehicles;
};

export default getVehicles;
