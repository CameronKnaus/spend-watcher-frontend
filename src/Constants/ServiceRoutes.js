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
    spendingSummary: spendApi('/summary'), // GET
    recentTransactions: spendApi('/recent'), // GET
    submitNewTransaction: spendApi('/new'), // POST
    submitEditTransaction: spendApi('/edit'), // POST
    submitDeleteTransaction: spendApi('/delete'), // POST
    addNewAccount: accountsApi('/new') // POST
};

export default SERVICE_ROUTES;