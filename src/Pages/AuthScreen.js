import React from 'react';
import styles from '../Styles/Pages/AuthScreen.module.css';
import AuthHandler from "../Util/AuthHandler";
import ServiceRoutes from "../Constants/ServiceRoutes";
import { PAGE_ROUTES } from '../Constants/RouteConstants';
import axios from 'axios';
import {useNavigate} from "react-router";
axios.defaults.withCredentials = true;

const REQUEST_TYPES = {
    register: 'register',
    login: 'login'
}

export default function AuthScreen() {
    let navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('')

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
            .then(() => {
                AuthHandler.setIsAuthenticated(true);
                navigate(PAGE_ROUTES.dashboard);
            })
            .catch((error) => {
                setErrorMessage(error.message || 'Some error occurred')
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // For detecting the enter key
    function _handleKeyDown(e) {
        if(e.key === 'Enter') {
            submitRequest();
        }
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authHeader}>Login or Register</div>
            <div className={styles.formContainer}>
                { errorMessage && <div className={styles.errorMessage}>{errorMessage}</div> }
                {
                    loading ? (
                        <h3 style={{textAlign: 'center'}}>loading....</h3>
                    ) : (
                        <>
                            <label className={styles.labels}>Username:</label>
                            <input className={styles.inputFields}
                                   placeholder='Username'
                                   type='text'
                                   value={username} onChange={e => setUsername(e.target.value)}
                                   onKeyDown={_handleKeyDown}
                            />
                            <label className={styles.labels}>Email:</label>
                            <input className={styles.inputFields}
                                   placeholder='Email Address'
                                   type='email'
                                   value={email} onChange={e => setEmail(e.target.value)}
                                   onKeyDown={_handleKeyDown}
                            />
                            <label className={styles.labels}>Password:</label>
                            <input className={styles.inputFields}
                                   id='loginPassword'
                                   placeholder='Password'
                                   type='password'
                                   value={password}
                                   onChange={e => setPassword(e.target.value)}
                                   onKeyDown={_handleKeyDown}
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
    );
}