import { SpendingCategoryType } from 'Constants/categories';
import { DateType, ISODateType } from './DateTypes';

// TODO: Consolidate all transaction types if possible
export type FormattedTransaction = {
    id: number | string;
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

export type TransactionListDiscretionary = {
    transactionId: number;
    category: SpendingCategoryType;
    amount: number;
    isUncommon: boolean;
    date: DateType;
    dateISO: ISODateType,
    note: string;
    linkedTripId?: string;
    isRecurringTransaction: false
}

export type TransactionListRecurring = RecurringTransaction & {
    amount: number,
    date: DateType;
    isRecurringTransaction: true
}

export type TransactionListTransaction = TransactionListDiscretionary | TransactionListRecurring;

export type TransactionList = Record<DateType, Array<TransactionListTransaction>>