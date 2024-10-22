import clsx from 'clsx';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './ErrorMessage.module.css';
import { ComponentProps } from 'react';

type ErrorMessagePropTypes = {
    title: string;
    message: string;
} & ComponentProps<'div'>;

export default function ErrorMessage({ title, message, className, ...props }: ErrorMessagePropTypes) {
    return (
        <div className={clsx(styles.errorContainer, className)} {...props}>
            <div className={styles.iconContainer}>
                <FaInfoCircle />
            </div>
            <div className={styles.messageText}>
                <h3>{title}</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}
