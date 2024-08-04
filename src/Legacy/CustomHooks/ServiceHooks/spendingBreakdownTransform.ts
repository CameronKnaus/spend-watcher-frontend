import { SpendingCategoryType } from 'Constants/categories_deprecated';
import { DateType } from 'Types/DateTypes';
import { CategoryTotalDataPoints, SpendingBreakdownTransaction, TransactionId } from 'Types/TransactionTypes';

export type PopulatedSpendingBreakdownResponse = {
    noTransactions?: never;
    startDate: DateType;
    endDate: DateType;
    finalTotalSpent: number;
    recurringSpendTotal: number;
    discretionaryTotal: number;
    transactionsMappedById: Record<TransactionId, SpendingBreakdownTransaction>;
    finalTotalTransactions: number;
    transactionsGroupedByDate: Record<DateType, Array<SpendingBreakdownTransaction>>;
    categoryTotals: Record<SpendingCategoryType, number>;
    totalTransactionsPerCategory: Record<SpendingCategoryType, number>;
    categoryTotalDataPoints: CategoryTotalDataPoints;
};

type NoTransactionResponse = {
    noTransactions: true;
};

export type RawSpendingBreakdownResponse = PopulatedSpendingBreakdownResponse | NoTransactionResponse;

export default function spendingBreakdownTransform({
    data,
}: {
    data: RawSpendingBreakdownResponse | NoTransactionResponse;
}): RawSpendingBreakdownResponse | NoTransactionResponse {
    return data;
}
