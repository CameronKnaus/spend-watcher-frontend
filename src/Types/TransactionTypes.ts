import { SpendingCategoryType } from 'Constants/categories';

export type Transaction = {
    amount: number;
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
    category: string,
    estimatedAmount: number,
    expenseName: string,
    isActive: boolean,
    isVariableRecurring: boolean,
    recurringSpendId: string
}