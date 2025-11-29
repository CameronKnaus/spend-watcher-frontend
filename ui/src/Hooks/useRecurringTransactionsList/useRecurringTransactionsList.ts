import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import type { RecurringSpendTransaction, RecurringTransactionsListV1Response } from 'Types/Services/spending.model';

export default function useRecurringTransactionsList(recurringSpendId: RecurringSpendTransaction['recurringSpendId']) {
    const { data, isLoading } = useQuery({
        queryKey: ['recurring', recurringSpendId],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getRecurringTransactionsList, {
                params: {
                    recurringSpendId,
                },
            });

            // TODO: Need better type handling so type casting isn't required.
            return response.data as RecurringTransactionsListV1Response;
        },
    });

    return {
        isLoading: isLoading,
        recurringTransactionsList: data?.transactions,
    };
}
