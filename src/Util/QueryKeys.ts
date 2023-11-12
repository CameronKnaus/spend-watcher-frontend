export const spendingBreakdownQueryKey = 'spending-breakdown';
export const spendingSummaryQueryKey = 'spending-summary';
export const tripManagerQueryKey = 'trip-manangement';
export const accountSummaryQueryKey = 'money-account-summary';
export const recurringExpenseTransactionHistoryQueryKey = 'recurring-expense-transaction-history';
export const recurringSpendingQueryKey = 'recurring-spending';


// Dependent query keys are all query keys that need to be invalidated when the user makes a modification.
// Ex. The user updates or adds a transaction, so spending breakdown queries should be invalidated
export const transactionDependentQueryKeys = [
    spendingBreakdownQueryKey,
    spendingSummaryQueryKey,
    tripManagerQueryKey
];

export const myMoneyDependentQueryKeys = [
    accountSummaryQueryKey
];

export const recurringTransactionDependentQueryKeys = [
    recurringSpendingQueryKey
];

export const tripDependentQueryKeys = [
    tripManagerQueryKey
];

export const allDependentQueryKeys = [
    ...transactionDependentQueryKeys,
    ...myMoneyDependentQueryKeys
];
