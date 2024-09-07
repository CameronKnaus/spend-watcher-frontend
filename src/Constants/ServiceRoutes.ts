import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
const { devMode, prodAPI, localAPI } = EnvironmentSettings;

const domainName = devMode ? localAPI : prodAPI;
// const spendApi = (routeName: string) => domainName + '/spending' + routeName;
// const accountsApi = (routeName: string) => domainName + '/accounts' + routeName;
// const recurringSpendApi = (routeName: string) => domainName + '/recurring' + routeName;
// const tripsApi = (routeName: string) => domainName + '/trips' + routeName;

const SERVICE_ROUTES: Record<string, string> = {
    postLogin: domainName + '/user/v1/login',
    postRegister: domainName + '/user/v1/register',
    getCheckAuthentication: domainName + '/user/v1/verify',
    getSpendingDetails: domainName + '/spending/v1/details',
    postDiscretionarySpending: domainName + '/spending/v1/discretionary/add',

    // transactionDateRange: spendApi('/available-range'), // GET
    // spendingSummary: spendApi('/summary'), // GET
    // recentTransactions: spendApi('/recent'), // GET
    // submitNewTransaction: spendApi('/new'), // POST
    // submitEditTransaction: spendApi('/edit'), // POST
    // submitDeleteTransaction: spendApi('/delete'), // POST
    // spendingBreakdown: spendApi('/breakdown'), // POST
    // addNewAccount: accountsApi('/new'), // POST
    // accountsSummary: accountsApi('/summary'), // GET
    // editAccount: accountsApi('/edit'), // POST
    // updateAccountBalance: accountsApi('/update'), // POST
    // submitNewRecurringExpense: recurringSpendApi('/new'), // POST
    // getAllRecurringExpenses: recurringSpendApi('/all_transactions'), // GET
    // deleteRecurringExpense: recurringSpendApi('/delete'), // POST
    // editRecurringExpense: recurringSpendApi('/edit'), // POST
    // updateRecurringExpense: recurringSpendApi('/update'), // POST
    // getRecurringExpenseTransactionHistory: recurringSpendApi('/transaction_history?'), // GET
    // getAllTripDetails: tripsApi('/all'), // GET
    // getExpensesLinkedToTrip: tripsApi('/linked_expenses?'), // GET
    // editTrip: tripsApi('/edit'), // POST
    // newTrip: tripsApi('/new'), // POST
    // deleteTrip: tripsApi('/delete'),
};

export default SERVICE_ROUTES;
