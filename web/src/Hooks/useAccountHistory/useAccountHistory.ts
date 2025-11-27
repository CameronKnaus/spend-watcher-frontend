import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import type { Account, AccountHistoryV1Response } from 'Types/Services/accounts.model';

export default function useAccountHistory(accountId: Account['id']) {
    return useQuery({
        queryKey: ['accounts', accountId],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getAccountValueHistory, {
                params: {
                    accountId,
                },
            });

            // TODO: Need better type handling so type casting isn't required.
            return response.data as AccountHistoryV1Response;
        },
    });
}
