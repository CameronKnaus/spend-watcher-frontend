// Utility for managing user's authentication state
function authHandler() {
    let authenticated = false;

    function setIsAuthenticated(newValue) {
        authenticated = newValue;
    }

    function isAuthenticated() {
        return authenticated;
    }

    return {
        isAuthenticated,
        setIsAuthenticated
    }
}

const AuthHandler = authHandler();
export default AuthHandler;