import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { SpendingDetailsV1Response } from 'Types/Services/spending.model';

export default function useSpendingDetailsService() {
    // TODO: Implement dynamic date range
    const startDate = '2024-11-01';
    const endDate = '2024-11-12';

    return useQuery<SpendingDetailsV1Response>({
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
