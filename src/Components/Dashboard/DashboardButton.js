import React from 'react';
import styles from 'Styles/Components/Dashboard/DashboardButton.module.css';
import clsx from 'clsx';

export default function DashboardButton({ text, buttonColor, callback, isDisabled }) {
    function handleClick() {
        if(isDisabled) {
            return;
        }

        callback();
    }

    return (
        <button className={clsx({ [styles.button]: true, [styles.disabledButton]: isDisabled })}
                style={{
                    backgroundColor: isDisabled ? 'var(--theme-disabled-button)' : buttonColor
                }}
                onClick={handleClick}
        >
            {text}
        </button>
    );
}