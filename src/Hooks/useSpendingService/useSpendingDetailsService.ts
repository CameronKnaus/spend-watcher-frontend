import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { SpendingDetailsResponse } from 'Types/Services/spending.model';

export default function useSpendingDetailsService() {
    const startDate = '2024-08-01';
    const endDate = '2024-08-31';

    return useQuery<SpendingDetailsResponse>({
        queryKey: ['spending', startDate, endDate],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getSpendingDetails, {
                params: {
                    startDate,
                    endDate,
                },
            });

            return response.data;
        },
    });
}
