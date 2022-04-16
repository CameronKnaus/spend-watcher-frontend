import EnvironmentSettings from '../Constants/EnvironmentSettings.json';
const {devMode, prodAPI, localAPI} = EnvironmentSettings;

const domainName = devMode ? localAPI : prodAPI;
const api = (routeName) => domainName + routeName;

const SERVICE_ROUTES = {
    login: api('/processLogin'),
    register: api('/processRegistration'),
    checkAuthentication: api('/checkAuthentication')
}

export default SERVICE_ROUTES;