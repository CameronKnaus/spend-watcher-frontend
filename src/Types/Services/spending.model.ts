import { DbDate } from 'Types/dateTypes';
import { SpendingCategory } from 'Types/SpendingCategory';
import { z as zod } from 'zod';

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

export type TotalsByCategory = {
    [category in SpendingCategory]?: SummaryTotals;
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
    note: string;
    linkedTripId?: string;
} & BaseSpendTransaction;

// Recurring spend transaction specific attributes
export type RecurringSpendTransaction = {
    transactionId: RecurringTransactionId;
    isRecurring: true;
    expectedMonthlyAmount: number;
    recurringSpendName: string; // spend_name from recurring
    recurringSpendId: string; // uuid string
    isVariableRecurring: boolean;
    isActive: boolean;
} & BaseSpendTransaction;

export type SpendTransaction = RecurringSpendTransaction | DiscretionarySpendTransaction;

// SPEND RELATED TYPES END --------------------------------------------

// ZOD CUSTOM VALIDATORS BEGIN --------------------------------------------
const zodValidateDiscretionaryId = zod.custom<DiscretionaryTransactionId>(
    (givenValue): givenValue is DiscretionaryTransactionId => {
        if (typeof givenValue === 'string' && /^Discretionary-\d+$/.test(givenValue)) {
            return true; // Valid format
        }
        return false; // Invalid format
    },
    {
        message: 'Invalid transactionId format. Expected format: "Discretionary-<number>".',
    },
);

// ZOD CUSTOM VALIDATORS END --------------------------------------------

// SPENDING DETAILS API --- /api/spending/v1/details
export const v1DetailsSchema = zod.object({
    startDate: zod.string().date(),
    endDate: zod.string().date(),
});

export type SpendingDetailsRequestParams = zod.infer<typeof v1DetailsSchema>;

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

export type SpendingDetailsV1Response = {
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
// END SPENDING DETAILS API --------------------------------------------

// LOG DISCRETIONARY API --- /api/spending/v1/discretionary/add
export const v1DiscretionaryAddSchema = zod.object({
    category: zod.nativeEnum(SpendingCategory),
    amountSpent: zod.number().safe().positive(),
    spentDate: zod.string().date(),
    note: zod.string().trim().max(100),
    linkedTripId: zod.string().uuid().optional(),
});

export type DiscretionaryAddRequestParams = zod.infer<typeof v1DiscretionaryAddSchema>;
// END LOG DISCRETIONARY API

// EDIT DISCRETIONARY API --- /api/spending/v1/discretionary/edit
export const v1DiscretionaryEditSchema = v1DiscretionaryAddSchema.extend({
    // Add the transactionId field
    transactionId: zodValidateDiscretionaryId,
});

export type DiscretionaryEditRequestParams = zod.infer<typeof v1DiscretionaryEditSchema>;
// END EDIT DISCRETIONARY API --------------------------------------------

// DELETE DISCRETIONARY API --- /api/spending/v1/discretionary/delete
export const v1DiscretionaryDeleteSchema = zod.object({
    transactionId: zodValidateDiscretionaryId,
});

export type DiscretionaryDeleteRequestParams = zod.infer<typeof v1DiscretionaryDeleteSchema>;
// EMD DELETE DISCRETIONARY API --------------------------------------------

// RECURRING SUMMARY API --- /api/spending/v1/recurring/summary
export type RecurringSummaryV1Response = {
    activeRecurringTransactions: RecurringSpendTransaction[];
    inactiveRecurringTransactions: RecurringSpendTransaction[];
    averageEstimatedMonthlyTotal: number;
    actualMonthlyTotal: number;
};
// END RECURRING SUMMARY API --------------------------------------------

// RECURRING ADD API --- /api/spending/v1/recurring/add
export const v1AddRecurringSpendSchema = zod.object({
    category: zod.nativeEnum(SpendingCategory),
    recurringSpendName: zod.string().trim().max(60),
    expectedMonthlyAmount: zod.number().safe().positive(),
    isVariableRecurring: zod.boolean(),
});

export type AddRecurringSpendRequestParams = zod.infer<typeof v1AddRecurringSpendSchema>;
// END RECURRING ADD API --------------------------------------------

// RECURRING EDIT API --- /api/spending/v1/recurring/edit
export const v1EditRecurringSpendSchema = v1AddRecurringSpendSchema.extend({
    // Add the transactionId field
    recurringSpendId: zod.string().uuid(),
});

export type EditRecurringSpendRequestParams = zod.infer<typeof v1EditRecurringSpendSchema>;

// END RECURRING EDIT API --------------------------------------------

// RECURRING DELETE API --- /api/spending/v1/recurring/delete
export const v1DeleteRecurringSpendSchema = zod.object({
    recurringSpendId: zod.string().uuid(),
});

export type DeleteRecurringSpendRequestParams = zod.infer<typeof v1DeleteRecurringSpendSchema>;
// END RECURRING DELETE API --------------------------------------------
