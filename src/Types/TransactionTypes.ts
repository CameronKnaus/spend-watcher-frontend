import { SpendingCategoryType } from 'Constants/categories';

// TODO: Consolidate all transaction types if possible
export type FormattedTransaction = {
    id: string;
    amount: number,
    category: SpendingCategoryType,
    date: string;
    isUncommon: boolean;
    note?: string;
    linkedTripId?: string;
}

export type Transaction = {
    amount: string;
    category: SpendingCategoryType;
    date: string;
    is_custom_category: number; // TODO: Make boolean on backend
    linked_trip_id?: string;
    note?: string;
    transaction_id: number;
    uncommon: number; // TODO: Make boolean on backend,
    username: string; // TODO: Remove this on backend?
}

export type RecurringTransaction = {
    actualAmount: number,
    category: SpendingCategoryType,
    estimatedAmount: number,
    expenseName: string,
    isActive: boolean,
    isVariableRecurring: boolean,
    recurringSpendId: string,
    transactionId?: string,
    requiresUpdate: boolean;
}

export type RecurringTransactionDetail = {
    transactionId: string;
    date: string;
    transactionAmount: number;
}