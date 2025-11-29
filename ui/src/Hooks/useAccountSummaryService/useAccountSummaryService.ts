import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import type { AccountsSummaryV1Response } from 'Types/Services/accounts.model';

export default function useAccountSummaryService() {
    return useQuery({
        queryKey: ['accounts', 'details'],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getAccountsSummary);
            // TODO: Need better type handling so type casting isn't required.
            return response.data as AccountsSummaryV1Response;
        },
    });
}
