const fetchRequestDetails = async (requestId: string, requestType: string) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/view_request_detail.php?request_id=${requestId}&request_type=${requestType}`;

    try {
        const res = await fetch(URL);
        const data = await res.json();

        // Extract the `detailslist` array
        const requests = data.detailslist || [];

        return requests;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw to allow error handling at the caller level
    }
};

export default fetchRequestDetails;