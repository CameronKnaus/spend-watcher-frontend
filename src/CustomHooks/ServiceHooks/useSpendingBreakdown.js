import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import msMapper from 'Util/Time/TimeMapping';

export default function useSpendingBreakdown(args) {
    const { startDate, endDate, includeRecurringTransactions, showAllData } = args;

    const { isLoading, isError, data, refetch } = useQuery({
        queryKey: [
            'spending-breakdown',
            startDate,
            endDate,
            includeRecurringTransactions,
            showAllData
        ],
        enabled: Boolean(startDate && endDate),
        refetchOnWindowFocus: false,
        staleTime: msMapper.minute * 10,
        queryFn: () => {
            return axios.post(SERVICE_ROUTES.spendingBreakdown, {
                startDate,
                endDate,
                includeRecurringTransactions,
                showAllData
            });
        }
    });

    return {
        spendingDataErrorOccurred: isError,
        spendingDataLoading: isLoading,
        spendingBreakdown: data?.data,
        refetchSpendingBreakdown: refetch
    };
}