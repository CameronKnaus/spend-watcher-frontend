import React from 'react';
import styles from '../../Styles/Components/Dashboard/ResistanceStats.module.css';
import msMapper from "../../Util/TimeMapping";

export default function ResistanceStats({urgesResisted, timesFailed, lastRelapseTimestamp}) {
    const GOAL_WEEKS = 5;
    const targetNumberOfDays = GOAL_WEEKS * 7;
    const lastRelapseDate = new Date(lastRelapseTimestamp);
    const currentTime = new Date();

    const timeSinceRelapse = Math.abs(currentTime - lastRelapseDate);
    const daysCruxFree = Math.floor(timeSinceRelapse / msMapper.day);

    return (
        <div className={styles.statContainer}>
            <div className={styles.title}>Top Stats</div>
            <div className={styles.statItem}>
                <span className={styles.successPoints}>
                    Urges Resisted:
                </span>
                <span className={styles.numberItem}>
                    {urgesResisted}
                </span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.failPoints}>
                    Times Failed:
                </span>
                <span className={styles.numberItem}>
                    {timesFailed}
                </span>
            </div>
            <div className={styles.statItem}>
                <span>
                    Progress to Benji:
                </span>
                <span className={`${styles.numberItem} ${styles.successPoints}`}>
                    {((daysCruxFree / targetNumberOfDays) * 100).toFixed(2)}%
                </span>
            </div>
        </div>
    )
}