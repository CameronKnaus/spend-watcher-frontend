// This utility allows for console logs and debugging that won't be included in production
import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
const DEV_MODE = EnvironmentSettings.devMode;

export function log(...args: any) {
    if(DEV_MODE) {
        // eslint-disable-next-line
        console.log(...args);
    }
}

export function error(...args: any) {
    if(DEV_MODE) {
        // eslint-disable-next-line
        console.error(...args);
    }
}

const logger = {
    log,
    error
};

export default logger;