import { RecurringTransaction } from 'Types/TransactionTypes';

interface RawMoneyAccountData {
    noTransactions?: boolean;
    estimateVariance: number;
    monthlyExpenseRequiresUpdate: boolean;
    recurringTransactions: Array<RecurringTransaction>;
    actualMonthTotal: number;
    estimatedMonthTotal: number;
    hasVariableRecurring: boolean;
}

// Currently not formatting data but can be changed in the future
export default function recurringSpendingTransform({ data }: { data: RawMoneyAccountData }): RawMoneyAccountData {
    return data;
}