import { SpendingCategoryType } from 'Constants/categories';
import englishContent from 'Content/englishContent.json';

// Managed in the sense that 'code' is used for state management and 'name' is used for the label on screen
export type ManagedTransactionType = {
    code: SpendingCategoryType,
    name: keyof typeof englishContent.SPENDING_CATEGORIES
}

// TODO: Consolidate all transaction types if possible
export type FormattedTransaction = {
    id: string;
    amount: number,
    category: ManagedTransactionType,
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
    recurringSpendId: string
}

export type RecurringTransactionDetail = {
    transactionId: string;
    date: string;
    transactionAmount: number;
}