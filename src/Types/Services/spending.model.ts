import { DbDate } from 'Types/dateTypes';
import { SpendingCategory } from 'Types/spendTransactionTypes';

// SPEND RELATED TYPES BEGIN --------------------------------------------
export type RecurringTransactionId = `${'Recurring-'}${number}`;
export type DiscretionaryTransactionId = `${'Discretionary-'}${number}`;
export type TransactionId = RecurringTransactionId | DiscretionaryTransactionId;

export type TransactionTotal = {
    // Total dollar amount
    amount: number;
    // Total number of transactions
    count: number;
};

// Summary data for a given list of transactions (includedTransactions)
export type SpendGroupSummary = {
    total: TransactionTotal;
    recurringTotal: TransactionTotal;
    discretionaryTotal: TransactionTotal;
    includedTransactions: TransactionId[];
};

export type SummaryTotals = Omit<SpendGroupSummary, 'includedTransactions'>;

// Mapped by date in a way that allows sorting by string
export type TransactionsByDate = Record<DbDate, SpendGroupSummary>;

// If given a discretionary transactionID, type of value will be casted to DiscretionarySpendTransaction and vice versa
export type TransactionDictionary = {
    [T in TransactionId]: T extends RecurringTransactionId
        ? RecurringSpendTransaction
        : T extends DiscretionaryTransactionId
          ? DiscretionarySpendTransaction
          : never;
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
    note?: string;
    linkedTripId?: string;
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

// SPEND RELATED TYPES END --------------------------------------------

// SPENDING DETAILS API --- /api/spending/v1/details
export interface SpendingDetailsRequestParams {
    startDate: DbDate;
    endDate: DbDate;
}

export type CategoryDetails = {
    category: SpendingCategory;
    amount: number;
    count: number;
    percentageOfTotalSpend: number;
    percentageOfTotalTransactions: number;
    percentageOfDiscretionarySpend: number;
    percentageOfDiscretionaryTransactions: number;
    percentageOfRecurringSpend: number;
    percentageOfRecurringTransactions: number;
};

export type SpendingDetailsResponse = {
    categoryDetailsList: CategoryDetails[];
    transactionDictionary: TransactionDictionary;
    spendTypeRatio: {
        discretionary: number;
        recurring: number;
    };
    summary: SummaryTotals;
    discretionaryTransactionIdList: DiscretionaryTransactionId[];
    recurringTransactionIdList: RecurringTransactionId[];
    transactionsByDate: TransactionsByDate;
};
// END SPENDING DETAILS API
