import { DbDate, MonthYearDbDate } from 'Types/dateTypes';
import { z as zod } from 'zod';

// SHARED ZOD VALIDATORS
const zodAccountName = zod.string().min(3, { message: 'Account names must be at least 3 characters' });

export interface Account {
    id: string;
    name: string;
    currentAccountValue: number;
    category: AccountCategory;
    isFixedRate: boolean;
    annualPercentageRate: number;
}

export interface DbMoneyAccountSchema {
    account_id: string;
    account_name: string;
    growth_rate: number;
    is_fixed: 1 | 0;
    type: AccountCategory;
    username: string;
}

export interface DbMoneyAccountUpdatesSchema {
    account_id: string;
    amount: number;
    date: DbDate;
}

// Supported account types
export enum AccountCategory {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
    INVESTING = 'INVESTING',
    BONDS = 'BONDS',
}

// ADD ACCOUNT SERVICE
export const addAccountRequestParamSchema = zod.object({
    accountName: zodAccountName,
    startingAccountValue: zod.number(),
    accountCategory: zod.nativeEnum(AccountCategory),
    isFixedRate: zod.boolean(),
    annualPercentageRate: zod.number().optional(),
});

export type AddAccountRequestParams = zod.infer<typeof addAccountRequestParamSchema>;

// UPDATE ACCOUNT BALANCE SERVICE
export const updateAccountBalanceRequestParamSchema = zod.object({
    accountId: zod.string().uuid(),
    newBalance: zod.number(),
    targetDate: zod.string().date(), // Validates in YYYY-MM-DD format
});

export type UpdateAccountBalanceRequestParams = zod.infer<typeof updateAccountBalanceRequestParamSchema>;

// EDIT ACCOUNT DETAILS SERVICE
export const editAccountDetailsRequestParamsSchema = zod.object({
    accountId: zod.string().uuid(),
    accountCategory: zod.nativeEnum(AccountCategory),
    accountName: zodAccountName,
    isFixedRate: zod.boolean(),
    annualPercentageRate: zod.number(),
});

export type EditAccountDetailsRequestParams = zod.infer<typeof editAccountDetailsRequestParamsSchema>;

// ACCOUNTS SUMMARY SERVICES
export type AccountsSummaryV1Response = {
    totalEquity: number;
    totalAccountsCount: number;
    accountsCountByCategory: Record<AccountCategory, number>;
    accountsList: (Account & {
        lastUpdated: MonthYearDbDate;
        requiresNewUpdate: boolean;
    })[];
};
