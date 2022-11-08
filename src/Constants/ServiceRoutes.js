import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
const { devMode, prodAPI, localAPI } = EnvironmentSettings;

const domainName = devMode ? localAPI : prodAPI;
const authApi = (routeName) => domainName + '/auth' + routeName;
const spendApi = (routeName) => domainName + '/spending' + routeName;
const accountsApi = (routeName) => domainName + '/accounts' + routeName;

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
    editAccount: accountsApi('/edit') // POST
};

export default SERVICE_ROUTES;