import React from 'react';
import styles from '../../Styles/Components/Dashboard/ActionLogger.module.css';

export default function ActionLogger({updateUrgesResisted, updateUrgeFailed}) {
    return (
        <div className={styles.container}>
            <button className={`${styles.actionButton} ${styles.positiveColor}`}
                    onClick={updateUrgesResisted}
            >
                I Resisted an Urge
            </button>
            <button className={`${styles.actionButton} ${styles.negativeColor}`}
                    onClick={updateUrgeFailed}
            >
                I Relapsed
            </button>
        </div>
    )
}