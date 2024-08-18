import { DbDate } from './dateTypes';

export enum SpendingCategory {
    AIRFARE = 'AIRFARE',
    BUSINESS = 'BUSINESS',
    CANNABIS = 'CANNABIS',
    CLOTHING = 'CLOTHING',
    DRINKS = 'DRINKS',
    EDUCATION = 'EDUCATION',
    ENTERTAINMENT = 'ENTERTAINMENT',
    FITNESS = 'FITNESS',
    FUEL = 'FUEL',
    GAMES = 'GAMES',
    GIFTS = 'GIFTS',
    GROOMING = 'GROOMING',
    GROCERIES = 'GROCERIES',
    HEALTH = 'HEALTH',
    HOBBY = 'HOBBY',
    HOUSING = 'HOUSING',
    INSURANCE = 'INSURANCE',
    LODGING = 'LODGING',
    MATERIAL_ITEMS = 'MATERIAL_ITEMS',
    OTHER = 'OTHER',
    PETS = 'PETS',
    RESTAURANTS = 'RESTAURANTS',
    TAXES = 'TAXES',
    TRANSPORTATION = 'TRANSPORTATION',
    TREATS = 'TREATS',
    UTILITIES = 'UTILITIES',
    VEHICLE = 'VEHICLE',
}

// These types are meant to be 1:1 with the front end.  Any changes here should be reflected in the front end.
type RecurringTransactionId = `${'Recurring-'}${number}`;
type DiscretionaryTransactionId = `${'Discretionary-'}${number}`;
export type TransactionId = RecurringTransactionId | DiscretionaryTransactionId;

export type TransactionTotal = {
    // Total dollar amount
    amount: number;
    // Total number of transactions
    count: number;
};

export type TransactionDictionary = Map<TransactionId, SpendTransaction>;

export type TransactionIdLists = {
    allTransactions: TransactionId[];
    discretionaryTransactions: DiscretionaryTransactionId[];
    recurringTransactions: RecurringTransactionId[];
};

// Summary data for a given list of transactions (includedTransactions)
export type SpendGroupSummary = {
    total: TransactionTotal;
    recurringTotal: TransactionTotal;
    discretionaryTotal: TransactionTotal;
    includedTransactions: TransactionId[];
};

// Shared attributes between all spend transactions
export type BaseSpendTransaction = {
    category: SpendingCategory;
    amountSpent: number; // transaction_amount from recurring
    spentDate: DbDate;
};

// Discretionary spend transaction specific attributes
export type DiscretionarySpendTransaction = {
    transactionId: DiscretionaryTransactionId;
    isRecurring: false;
    note: string | null;
    linkedTripId: string | null;
} & BaseSpendTransaction;

// Recurring spend transaction specific attributes
export type RecurringSpendTransaction = {
    transactionId: RecurringTransactionId;
    isRecurring: true;
    expectedMonthlyAmount: number;
    recurringSpendName: string; // spend_name from recurring
    recurringSpendId: string;
    isVariableRecurring: boolean;
    isActive: boolean;
} & BaseSpendTransaction;

export type SpendTransaction = RecurringSpendTransaction | DiscretionarySpendTransaction;
