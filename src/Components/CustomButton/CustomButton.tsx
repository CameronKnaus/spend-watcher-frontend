import styles from './CustomButton.module.css';
import { clsx } from 'clsx';
import { ComponentProps, ReactNode } from 'react';

type CustomButtonPropTypes = {
    onClick: () => void;
    children: ReactNode;
    variant: 'primary' | 'secondary' | 'tertiary';
    isDisabled?: boolean;
    layout?: 'fit-content' | 'full-width';
    className?: string;
    backgroundColor?: string;
};

// Background color must be provided by the parent component
export default function CustomButton({
    onClick,
    variant,
    isDisabled = false,
    layout = 'fit-content',
    className = '',
    children,
}: CustomButtonPropTypes & ComponentProps<'button'>) {
    function handleClick() {
        if (isDisabled) {
            return;
        }

        onClick();
    }
    const classList = clsx([styles.defaultButton, className, isDisabled && styles.disabled, styles[variant]]);

    return (
        <button
            className={classList}
            style={{
                width: layout === 'full-width' ? '100%' : 'fit-content',
            }}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}
