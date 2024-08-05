import styles from './CustomButton.module.css';
import { clsx } from 'clsx';

type CustomButtonPropTypes = {
    text: string;
    onClick: () => void;
    isDisabled?: boolean;
    layout?: 'fit-content' | 'full-width';
    className?: string;
};

// Background color must be provided by the parent component
export default function CustomButton({
    text,
    onClick,
    isDisabled = false,
    layout = 'fit-content',
    className = '',
}: CustomButtonPropTypes) {
    function handleClick() {
        if (isDisabled) {
            return;
        }

        onClick();
    }

    const classList = clsx({
        [styles.defaultButton]: true,
        [className]: Boolean(className),
        [styles.disabled]: isDisabled,
    });

    return (
        <button
            className={classList}
            style={{
                width: layout === 'full-width' ? '100%' : 'fit-content',
            }}
            onClick={handleClick}
        >
            {text}
        </button>
    );
}
