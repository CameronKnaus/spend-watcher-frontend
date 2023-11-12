import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import msMapper from 'Util/Time/TimeMapping';
import { spendingBreakdownQueryKey } from '../../Util/QueryKeys';
import { DateType } from 'Types/DateTypes';

type UseSpendingBreakdownArgs = {
    startDate: DateType;
    endDate: DateType;
    includeRecurringTransactions: boolean;
    showAllData: number;
}

export default function useSpendingBreakdown(args: UseSpendingBreakdownArgs) {
    const { startDate, endDate, includeRecurringTransactions, showAllData } = args;

    const { isLoading, isError, data, refetch } = useQuery({
        queryKey: [
            spendingBreakdownQueryKey,
            startDate,
            endDate,
            includeRecurringTransactions,
            showAllData
        ],
        enabled: Boolean(startDate && endDate),
        refetchOnWindowFocus: false,
        staleTime: msMapper.day,
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