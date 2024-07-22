import { AccountCategoryType } from 'Constants/categories_deprecated';

export type MoneyAccount = {
    accountId: string;
    accountName: string;
    hasVariableGrowthRate: boolean;
    currentAccountValue: number;
    accountType: AccountCategoryType;
    growthRate: string;
    lastUpdated?: string;
    requiresNewUpdate: boolean;
};

// For the services used in editing and adding money accounts
export type MoneyAccountPayload = {
    accountName: string;
    accountCategory: AccountCategoryType;
    startingAccountValue: number;
    growthRate: number;
    hasVariableGrowthRate: boolean;
    accountId?: string;
};

export type UpdateAccountBalancePayload = {
    accountId: string;
    accountValue: number;
    isRevision: boolean;
};
