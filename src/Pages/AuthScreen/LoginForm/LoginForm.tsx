import { zodResolver } from '@hookform/resolvers/zod';
import CustomButton from 'Components/CustomButton/CustomButton';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { LoginRequestParams, loginRequestParamsSchema } from 'Types/Services/auth.model';
import styles from '../AuthScreen.module.css';

type LoginFormPropTypes = {
    switchToRegister: () => void;
};

export default function LoginForm({ switchToRegister }: LoginFormPropTypes) {
    const getContent = useContent('authScreen');
    const form = useForm<LoginRequestParams>({
        resolver: zodResolver(loginRequestParamsSchema),
    });

    function handleSubmission() {
        // TODO: Implement login
    }

    return (
        <>
            <label>{getContent('email')}</label>
            <input
                className={styles.textInput}
                placeholder={getContent('email')}
                autoComplete="off"
                {...form.register('email', { maxLength: 100 })}
            />
            <label>{getContent('password')}</label>
            <input
                className={styles.textInput}
                placeholder={getContent('password')}
                autoComplete="off"
                {...form.register('password', { maxLength: 100 })}
            />
            <div className={styles.buttonRowContainer}>
                <CustomButton variant="secondary" onClick={switchToRegister} layout="full-width">
                    {getContent('register')}
                </CustomButton>
                <CustomButton
                    isDisabled={!form.formState.isValid}
                    variant="primary"
                    onClick={form.handleSubmit(handleSubmission)}
                    layout="full-width"
                >
                    {getContent('submit')}
                </CustomButton>
            </div>
        </>
    );
}
