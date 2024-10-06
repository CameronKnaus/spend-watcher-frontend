import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
const { devMode, prodAPI, localAPI } = EnvironmentSettings;

const domainName = devMode ? localAPI : prodAPI;

const SERVICE_ROUTES: Record<string, string> = {
    postLogin: domainName + '/user/v1/login',
    postRegister: domainName + '/user/v1/register',
    getCheckAuthentication: domainName + '/user/v1/verify',
    getSpendingDetails: domainName + '/spending/v1/details',
    postAddDiscretionarySpending: domainName + '/spending/v1/discretionary/add',
    postEditDiscretionarySpending: domainName + '/spending/v1/discretionary/edit',
    postDeleteDiscretionarySpending: domainName + '/spending/v1/discretionary/delete',
    getRecurringSummary: domainName + '/spending/v1/recurring/summary',
    postAddRecurringSpend: domainName + '/spending/v1/recurring/add',
    postEditRecurringSpend: domainName + '/spending/v1/recurring/edit',
    postDeleteRecurringSpend: domainName + '/spending/v1/recurring/delete',
    postUpdateRecurringSpendStatus: domainName + '/spending/v1/recurring/set-active',
    getRecurringTransactionsList: domainName + '/spending/v1/recurring/transactions',
    postEditRecurringTransaction: domainName + '/spending/v1/recurring/transactions/edit',
};

export default SERVICE_ROUTES;
