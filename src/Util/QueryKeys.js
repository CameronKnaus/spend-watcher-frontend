export const spendingBreakdownQueryKey = 'spending-breakdown';

// Dependent query keys are all query keys that need to be invalidated when the user makes a modification.
// Ex. The user updates or adds a transaction, so spending breakdown queries should be invalidated
export const transactionDependentQueryKeys = [
    spendingBreakdownQueryKey
];

export const myMoneyDependentQueryKeys = [];

export const allDependentQueryKeys = [
    ...transactionDependentQueryKeys,
    ...myMoneyDependentQueryKeys
];

export function invalidateTransactionQueries(queryClient) {
    transactionDependentQueryKeys.forEach((key) => {
        queryClient.invalidateQueries(key);
    });
}

export function invalidateMyMoneyQueries(queryClient) {
    myMoneyDependentQueryKeys.forEach((key) => {
        queryClient.invalidateQueries(key);
    });
}

export function invalidateAllDependentQueries(queryClient) {
    allDependentQueryKeys.forEach((key) => {
        queryClient.invalidateQueries(key);
    });
}