import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CustomButton from 'Components/CustomButton/CustomButton';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { type LoginRequestParams, loginRequestParamsSchema } from 'Types/Services/auth.model';
import styles from '../AuthScreen.module.css';
axios.defaults.withCredentials = true;

interface LoginFormPropTypes {
    switchToRegister: () => void;
}

export default function LoginForm({ switchToRegister }: LoginFormPropTypes) {
    const queryClient = useQueryClient();
    const getContent = useContent('authScreen');
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginRequestParams>({
        resolver: zodResolver(loginRequestParamsSchema),
        mode: 'onChange',
    });

    const loginService = useMutation({
        mutationFn: (params: LoginRequestParams) => axios.post(SERVICE_ROUTES.postLogin, params),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ['verify-auth'],
            });
        },
        onError: () => {
            // TODO: Error handling
        },
    });

    async function handleSubmission(fieldValues: LoginRequestParams) {
        await loginService.mutateAsync(fieldValues);
    }

    return (
        <form onSubmit={handleSubmit(handleSubmission)}>
            <div className={styles.formGroup}>
                <label>{getContent('username')}</label>
                <input
                    className={styles.textInput}
                    placeholder={getContent('username')}
                    autoComplete="username"
                    type="username"
                    {...register('username')}
                />
                {errors.username?.message && <p className={styles.errorText}>{errors.username.message}</p>}
            </div>
            <div className={styles.formGroup}>
                <label>{getContent('password')}</label>
                <input
                    className={styles.textInput}
                    placeholder={getContent('password')}
                    autoComplete="current-password"
                    type="password"
                    {...register('password')}
                />
                {errors.password?.message && <p className={styles.errorText}>{errors.password.message}</p>}
            </div>
            <div className={styles.buttonRowContainer}>
                <CustomButton
                    isDisabled={loginService.isPending}
                    variant="secondary"
                    onClick={switchToRegister}
                    layout="full-width"
                >
                    {getContent('register')}
                </CustomButton>
                <CustomButton
                    isDisabled={!isValid || loginService.isPending}
                    variant="primary"
                    type="submit"
                    layout="full-width"
                >
                    {getContent('submit')}
                </CustomButton>
            </div>
        </form>
    );
}
