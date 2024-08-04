import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { spendingBreakdownQueryKey } from '../../Util/QueryKeys';
import { DateType } from 'Types/DateTypes';
import spendingBreakdownTransform, { PopulatedSpendingBreakdownResponse } from './spendingBreakdownTransform';

type UseSpendingBreakdownArgs = {
    startDate: DateType;
    endDate: DateType;
    includeRecurringTransactions: boolean;
    showAllData: boolean;
}

type SpendingBreakdownReturnValue = {
    spendingDataErrorOccurred: boolean;
    spendingDataLoading: boolean;
    spendingBreakdown?: PopulatedSpendingBreakdownResponse;
    noTransactions: false;
} | {
    spendingDataErrorOccurred: boolean;
    spendingDataLoading: boolean;
    spendingBreakdown?: never;
    noTransactions: true;
};

export default function useSpendingBreakdown(args: UseSpendingBreakdownArgs): SpendingBreakdownReturnValue {
    const { startDate, endDate, includeRecurringTransactions, showAllData } = args;

    const { isLoading, isError, data } = useQuery({
        queryKey: [
            spendingBreakdownQueryKey,
            startDate,
            endDate,
            includeRecurringTransactions,
            showAllData
        ],
        enabled: Boolean(startDate && endDate),
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.post(SERVICE_ROUTES.spendingBreakdown, {
                startDate,
                endDate,
                includeRecurringTransactions,
                showAllData
            });
        },
        select: spendingBreakdownTransform
    });

    if(data?.noTransactions) {
        return {
            spendingDataErrorOccurred: isError,
            spendingDataLoading: isLoading,
            noTransactions: true
        };
    }

    return {
        spendingDataErrorOccurred: isError,
        spendingDataLoading: isLoading,
        spendingBreakdown: data,
        noTransactions: false
    };
}