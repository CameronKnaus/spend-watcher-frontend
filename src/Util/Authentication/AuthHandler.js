// Utility for managing user's authentication state
function authHandler() {
    let authenticated = false;
    let username = '';

    function setIsAuthenticated(newValue) {
        authenticated = newValue;
    }

    function isAuthenticated() {
        return authenticated;
    }

    function setUsername(newName) {
        username = newName;
    }

    function getUsername() {
        return username;
    }

    return {
        isAuthenticated,
        setIsAuthenticated,
        getUsername,
        setUsername
    };
}

const AuthHandler = authHandler();
export default AuthHandler;