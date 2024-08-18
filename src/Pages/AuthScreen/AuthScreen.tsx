import React from 'react';
import styles from './AuthScreen.module.css';
import ServiceRoutes from 'Constants/ServiceRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';
axios.defaults.withCredentials = true;

enum REQUEST_TYPES {
    register = 'postRegister',
    login = 'postLogin',
}

export default function AuthScreen() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    function submitRequest(requestType: REQUEST_TYPES) {
        if (loading) {
            return;
        }

        setLoading(true);
        setErrorMessage('');

        const route = ServiceRoutes[requestType];
        axios
            .post(route, {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
            })
            .then(() => {
                navigate(PAGE_ROUTES.dashboard);
            })
            .catch((error) => {
                const customMessage = error?.response?.data?.message;
                setErrorMessage(customMessage || error.message || 'Some unknown error occurred');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <p style={{ color: '#333' }}>
                This is a personal project for self improvement and front-end skill showcasing, but please ignore the
                poor quality of this authentication screen.
            </p>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>Login or Register</div>
                <div className={styles.formContainer}>
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                    {loading ? (
                        <h3 style={{ textAlign: 'center' }}>loading....</h3>
                    ) : (
                        <>
                            <label className={styles.labels}>Username:</label>
                            <input
                                className={styles.inputFields}
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label className={styles.labels}>Email:</label>
                            <input
                                className={styles.inputFields}
                                placeholder="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className={styles.labels}>Password:</label>
                            <input
                                className={styles.inputFields}
                                id="loginPassword"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </>
                    )}
                </div>
                <button
                    className={`${styles.submitButton} ${styles.registerButton}`}
                    onClick={() => submitRequest(REQUEST_TYPES.register)}
                >
                    Register
                </button>
                <button className={styles.submitButton} onClick={() => submitRequest(REQUEST_TYPES.login)}>
                    Login
                </button>
            </div>
        </>
    );
}
