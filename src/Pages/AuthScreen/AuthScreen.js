import React from 'react';
import styles from './AuthScreen.module.css';
import AuthHandler from 'Util/AuthHandler';
import ServiceRoutes from 'Constants/ServiceRoutes';
import { PAGE_ROUTES } from 'Constants/RouteConstants';
import axios from 'axios';
import { useNavigate } from 'react-router';
import useTripDetails from 'CustomHooks/useTripDetails';
axios.defaults.withCredentials = true;

const REQUEST_TYPES = {
    register: 'register',
    login: 'login'
};

export default function AuthScreen() {
    let navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const { refreshTrips } = useTripDetails();

    React.useEffect(() => {
        if(AuthHandler.isAuthenticated()) {
            navigate(PAGE_ROUTES.dashboard);
        }
    }, [navigate]);

    function submitRequest(requestType) {
        if(loading) {
            return;
        }

        setLoading(true);
        setErrorMessage('');

        const route = ServiceRoutes[requestType];
        axios.post(route, {
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password
        })
            .then((response) => {
                AuthHandler.setIsAuthenticated(true);
                AuthHandler.setUsername(response.data.username);
                refreshTrips();
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
                This is a personal project for self improvement and front-end skill showcasing, so please ignore the poor quality of this authentication screen.
            </p>
            <p style={{ color: '#777' }}>
                Do not use a password you use elsewhere as security is not production-ready on this site.
            </p>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>
                    Login or Register
                </div>
                <div className={styles.formContainer}>
                    {
                        errorMessage &&
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    }
                    {
                        loading ? (
                            <h3 style={{ textAlign: 'center' }}>
                                loading....
                            </h3>
                        ) : (
                            <>
                                <label className={styles.labels}>
                                    Username:
                                </label>
                                <input className={styles.inputFields}
                                       placeholder='Username'
                                       type='text'
                                       value={username} onChange={e => setUsername(e.target.value)}
                                />
                                <label className={styles.labels}>
                                    Email:
                                </label>
                                <input className={styles.inputFields}
                                       placeholder='Email Address'
                                       type='email'
                                       value={email} onChange={e => setEmail(e.target.value)}
                                />
                                <label className={styles.labels}>
                                    Password:
                                </label>
                                <input className={styles.inputFields}
                                       id='loginPassword'
                                       placeholder='Password'
                                       type='password'
                                       value={password}
                                       onChange={e => setPassword(e.target.value)}
                                />
                            </>
                        )
                    }
                </div>
                <button className={`${styles.submitButton} ${styles.registerButton}`}
                        onClick={() => submitRequest(REQUEST_TYPES.register)}
                >
                    Register
                </button>
                <button className={styles.submitButton}
                        onClick={() => submitRequest(REQUEST_TYPES.login)}
                >
                    Login
                </button>
            </div>
        </>
    );
}