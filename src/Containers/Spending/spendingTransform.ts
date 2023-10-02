import { RecurringTransaction, Transaction } from 'Types/TransactionTypes';

interface RawSpendingData {
    totalSpentThisMonth: string,
    spending: {
        currentMonthTotal: string,
        currentMonthTransactions: Array<Transaction>
    },
    recurringSpending: {
        noTransactions: boolean,
        actualMonthTotal: number,
        estimateVariance: number,
        estimatedMonthTotal: number,
        hasVariableRecurring: boolean,
        monthlyExpenseRequiresUpdate: boolean,
        recurringTransactions: Array<RecurringTransaction>
    }
}

// Currently not formatting data but can be changed in the future
export default function spendingTransform({ data }: { data: RawSpendingData }): RawSpendingData {
    return data;
}