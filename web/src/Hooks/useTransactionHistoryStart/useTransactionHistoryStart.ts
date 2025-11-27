import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import type { SpendingHistoryStartV1Response } from 'Types/Services/spending.model';

// TODO: Currently Unused
export default function useTransactionHistoryStart() {
    return useQuery({
        queryKey: ['spending', 'recurring', 'history-start'],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getSpendingHistoryStart);
            // TODO: Need better type handling so type casting isn't required.
            return response.data as SpendingHistoryStartV1Response;
        },
    });
}
