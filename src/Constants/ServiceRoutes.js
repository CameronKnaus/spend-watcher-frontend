import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
const { devMode, prodAPI, localAPI } = EnvironmentSettings;

const domainName = devMode ? localAPI : prodAPI;
const authApi = (routeName) => domainName + '/auth' + routeName;
const spendApi = (routeName) => domainName + '/spending' + routeName;
const accountsApi = (routeName) => domainName + '/accounts' + routeName;
const recurringSpendApi = (routeName) => domainName + '/recurring' + routeName;
const tripsApi = (routeName) => domainName + '/trips' + routeName;

const SERVICE_ROUTES = {
    login: authApi('/processLogin'), // POST
    register: authApi('/processRegistration'), // POST
    checkAuthentication: authApi('/verifyLogin'), // GET
    transactionDateRange: spendApi('/available-range'), // GET
    spendingSummary: spendApi('/summary'), // GET
    recentTransactions: spendApi('/recent'), // GET
    submitNewTransaction: spendApi('/new'), // POST
    submitEditTransaction: spendApi('/edit'), // POST
    submitDeleteTransaction: spendApi('/delete'), // POST
    spendingBreakdown: spendApi('/breakdown'), // POST
    addNewAccount: accountsApi('/new'), // POST
    accountsSummary: accountsApi('/summary'), // GET
    editAccount: accountsApi('/edit'), // POST
    updateAccountBalance: accountsApi('/update'), // POST
    submitNewRecurringExpense: recurringSpendApi('/new'), // POST
    getAllRecurringExpenses: recurringSpendApi('/all_transactions'), // GET
    deleteRecurringExpense: recurringSpendApi('/delete'), // POST
    editRecurringExpense: recurringSpendApi('/edit'), // POST
    updateRecurringExpense: recurringSpendApi('/update'), // POST
    getRecurringExpenseTransactionHistory: recurringSpendApi('/transaction_history?'), // GET
    getAllTripDetails: tripsApi('/all'), // GET
    getExpensesLinkedToTrip: tripsApi('/linked_expenses?'), // GET
    editTrip: tripsApi('/edit'), // POST
    newTrip: tripsApi('/new'), // POST
    deleteTrip: tripsApi('/delete')
};

export default SERVICE_ROUTES;