import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { DbDate } from 'Types/dateTypes';
import {
    SpendGroupSummary,
    SpendingCategory,
    TransactionDictionary,
    TransactionIdLists,
    TransactionTotal,
} from 'Types/spendTransactionTypes';

// Subtypes
type CategoryTrends = {
    totalsByCategory: Map<SpendingCategory, TransactionTotal>;
};

type SummaryData = Omit<SpendGroupSummary, 'includedTransactions'>;

// Mapped by date in a way that allows sorting by string
export type TransactionsByDate = Record<DbDate, SpendGroupSummary>;

// Full response type
export type SpendingDetailsResponse = {
    categoryTrends: CategoryTrends;
    transactionDictionary: TransactionDictionary;
    spendTypeRatio: {
        discretionary: number;
        recurring: number;
    };
    summary: SummaryData;
    transactionIdLists: TransactionIdLists;
    transactionsByDate: TransactionsByDate;
};

export default function useSpendingDetailsService() {
    const startDate = '2024-08-01';
    const endDate = '2024-08-18';

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
