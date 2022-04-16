import EnvironmentSettings from '../Constants/EnvironmentSettings.json';
const {devMode, prodAPI, localAPI} = EnvironmentSettings;

const domainName = devMode ? localAPI : prodAPI;
const authApi = (routeName) => domainName + '/auth' + routeName;

const SERVICE_ROUTES = {
    login: authApi('/processLogin'), // POST
    register: authApi('/processRegistration'), // POST
    checkAuthentication: authApi('/verifyLogin') // GET
}

export default SERVICE_ROUTES;