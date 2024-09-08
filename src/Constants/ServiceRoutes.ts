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
};

export default SERVICE_ROUTES;
