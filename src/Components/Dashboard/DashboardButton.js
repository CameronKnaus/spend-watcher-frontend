import React from 'react';
import styles from '../../Styles/Components/Dashboard/DashboardButton.module.css';

export default function DashboardButton({ text, buttonColor, callback }) {
    return (
        <button className={styles.button}
                style={{
                    backgroundColor: buttonColor
                }}
                onClick={callback}
        >
            {text}
        </button>
    );
}