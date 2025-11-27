import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import type { AccountGrowthOverTimeV1Response } from 'Types/Services/accounts.model';

export default function useAccountGrowthOverTimeService() {
    return useQuery({
        queryKey: ['accounts', 'growthOverTime'],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getAccountGrowthOverTime);
            // TODO: Need better type handling so type casting isn't required.
            return response.data as AccountGrowthOverTimeV1Response;
        },
    });
}
