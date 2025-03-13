import useContent from 'Hooks/useContent';
import styles from './AuthScreen.module.css';
import LoginForm from './LoginForm/LoginForm';

export default function AuthScreen() {
    const getContent = useContent('authScreen');
    // const [isRegistering, setIsRegistering] = useState(false);

    return (
        <div className={styles.authContainer}>
            <div className={styles.spendWatcherHeader}>{getContent('welcome')}</div>
            <div className={styles.formHeader}>{getContent('login')}</div>
            {/*TODO: Reimplement registration capabilities*/}
            {/* <div className={styles.formHeader}>{isRegistering ? getContent('register') : getContent('login')}</div> */}
            {/* {isRegistering ? (
                <RegisterForm
                    switchToLogin={() => {
                        setIsRegistering(false);
                    }}
                />
            ) : (
                <LoginForm
                    switchToRegister={() => {
                        setIsRegistering(true);
                    }}
                />
            )} */}
            <LoginForm
                switchToRegister={() => {
                    // TODO: Reimplement
                    // setIsRegistering(true);
                }}
            />
        </div>
    );
}
