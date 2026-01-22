"use client";

import useAuthStore from "@/hooks/use-user";
import {useQuery} from "@tanstack/react-query";

const getRequests = async (): Promise<any> => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const companyId = useAuthStore((state) => state.getCompanyId());

    const URL=`${process.env.NEXT_PUBLIC_API_URL}/company_request.php?company_id=${companyId}&request_status=all`;

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData', companyId],
        queryFn: async () => {
            try {
                const res = await fetch(URL);
                const data = await res.json();

                // Extract the `detailslist` array
                const requests = data.detailslist || [];

                return requests;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error; // Re-throw to allow useQuery to handle it
            }
        },
    });

    const requests = Array.isArray(data) ? data.reverse() : [];

};

export default getRequests;