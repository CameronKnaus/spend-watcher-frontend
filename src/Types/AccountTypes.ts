import { AccountCategoryType } from 'Constants/categories';
import englishContent from 'Content/englishContent.json';

// Managed in the sense that 'code' is used for state management and 'name' is used for the label on screen
export type ManagedAccountType = {
    code: AccountCategoryType;
    name: keyof typeof englishContent.ACCOUNT_CATEGORIES;
}

export type MoneyAccount = {
    accountId: string;
    accountName: string;
    hasVariableGrowthRate: boolean;
    currentAccountValue: number;
    accountType: AccountCategoryType;
    growthRate: string;
}

// For the services used in editing and adding money accounts
export type MoneyAccountPayload = {
    accountName: string;
    accountCategory: AccountCategoryType;
    startingAccountValue: number;
    growthRate: number;
    hasVariableGrowthRate: boolean;
    accountId?: string;
}
