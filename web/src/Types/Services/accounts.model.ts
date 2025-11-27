import type { DbDate, MonthYearDbDate } from 'Types/dateTypes';
import zodValidateMonthYear from 'Util/zodCustomValidators/zodValidateMonthYear';
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

export type AccountWithStatus = Account & {
    lastUpdated: MonthYearDbDate;
    requiresNewUpdate: boolean;
};

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
const accountCategoryEnum = zod.enum(Object.values(AccountCategory) as [AccountCategory, ...AccountCategory[]]);

// ADD ACCOUNT SERVICE
export const addAccountRequestParamSchema = zod.object({
    accountName: zodAccountName,
    startingAccountValue: zod.number(),
    accountCategory: accountCategoryEnum,
    isFixedRate: zod.boolean(),
    annualPercentageRate: zod.number().optional(),
});

export type AddAccountRequestParams = zod.infer<typeof addAccountRequestParamSchema>;

// UPDATE ACCOUNT BALANCE SERVICE
export const updateAccountBalanceRequestParamSchema = zod.object({
    accountId: zod.uuid(),
    newBalance: zod.number(),
    targetDate: zod.iso.date(), // Validates in YYYY-MM-DD format
});

export type UpdateAccountBalanceRequestParams = zod.infer<typeof updateAccountBalanceRequestParamSchema>;

// EDIT ACCOUNT DETAILS SERVICE
export const editAccountDetailsRequestParamsSchema = addAccountRequestParamSchema
    .extend({
        accountId: zod.uuid(),
    })
    .omit({
        startingAccountValue: true,
    });

export type EditAccountDetailsRequestParams = zod.infer<typeof editAccountDetailsRequestParamsSchema>;

// ACCOUNTS SUMMARY SERVICES
export interface AccountsSummaryV1Response {
    totalEquity: number;
    totalAccountsCount: number;
    accountsCountByCategory: Record<AccountCategory, number>;
    accountTotalsByType: Record<AccountCategory, number>;
    accountsList: AccountWithStatus[];
}

// ACCOUNTS SET ACTIVE SERVICE /v1/set-active
export const setActiveAccountRequestParamSchema = zod.object({
    accountId: zod.uuid(),
    isActive: zod.boolean(),
});

export type SetActiveAccountRequestParams = zod.infer<typeof setActiveAccountRequestParamSchema>;

// PERMANENTLY DELETE ACCOUNT SERVICE /v1/delete
export const deleteAccountRequestParamSchema = zod.object({
    accountId: zod.uuid(),
});

export type DeleteAccountRequestParams = zod.infer<typeof deleteAccountRequestParamSchema>;

// ACCOUNTS HISTORY SERVICE /v1/history
export const accountsHistoryRequestParamSchema = zod.object({
    accountId: zod.uuid(),
});

export type AccountsHistoryV1RequestParams = zod.infer<typeof accountsHistoryRequestParamSchema>;

export interface AccountHistoryV1Response {
    accountId: string;
    updateHistory: {
        date: MonthYearDbDate;
        amount: number;
        updateId: number;
    }[];
}

// ACCOUNTS ADD NEW UPDATE SERVICE /v1/update/add
export const addAccountUpdateRequestParamSchema = zod.object({
    accountId: zod.uuid(),
    amount: zod.number(),
    date: zodValidateMonthYear,
});

export type AddAccountUpdateV1RequestParams = zod.infer<typeof addAccountUpdateRequestParamSchema>;

// ACCOUNTS EDIT EXISTING ACCOUNT UPDATE VALUE /v1/update/edit
export const editAccountUpdateRequestParamSchema = zod.object({
    accountId: zod.uuid(),
    updateId: zod.number(),
    amount: zod.number(),
});

export type EditAccountUpdateV1RequestParams = zod.infer<typeof editAccountUpdateRequestParamSchema>;

// ACCOUNTS GROWTH OVER TIME SERVICE v1/account/growth-over-time
export interface AccountValueDataPoint {
    accountId: string; // uuid string
    accountName: string;
    date: DbDate;
    amount: number;
}

export type AccountGrowthOverTimeV1Response = AccountValueDataPoint[];
