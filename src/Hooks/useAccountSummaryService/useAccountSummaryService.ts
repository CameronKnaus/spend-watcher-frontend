import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { AccountsSummaryV1Response } from 'Types/Services/accounts.model';

export default function useAccountSummaryService() {
    const { isLoading, isFetching, data } = useQuery<AccountsSummaryV1Response>({
        queryKey: ['account', 'details'],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getAccountsSummary);
            return response.data;
        },
    });

    return {
        isLoading: isLoading || isFetching,
        accountsSummary: data,
    };
}
