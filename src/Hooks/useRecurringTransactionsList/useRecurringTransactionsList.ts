import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { RecurringSpendTransaction, RecurringTransactionsListV1Response } from 'Types/Services/spending.model';

export default function useRecurringTransactionsList(recurringSpendId: RecurringSpendTransaction['recurringSpendId']) {
    const { data, isFetching, isLoading } = useQuery<RecurringTransactionsListV1Response>({
        queryKey: ['recurring', recurringSpendId],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getRecurringTransactionsList, {
                params: {
                    recurringSpendId,
                },
            });

            return response.data;
        },
    });

    return {
        isLoading: isFetching || isLoading,
        recurringTransactionsList: data?.transactions,
    };
}
