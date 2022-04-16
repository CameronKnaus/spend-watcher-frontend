import React from 'react';
import styles from '../../Styles/Components/Dashboard/PeerStats.module.css';
import getTimeBetweenDates from "../../Util/getTimeBetweenDates";

export default function PeerStats({username, lastRelapseTimestamp, userCrux, refreshButton}) {
    if(!lastRelapseTimestamp) {
        return null;
    }

    const lastRelapseDate = new Date(lastRelapseTimestamp);
    const timeDifferences = getTimeBetweenDates(lastRelapseDate);

    return (
        <div className={styles.headerContainer}>
            <button className={styles.refreshButton} onClick={refreshButton}>&#x21bb;</button>
            <div className={styles.title}>{username} has been {userCrux} free for:</div>
            <div className={styles.timesContainer}>
                <div className={styles.timeItem}>
                    Months: {timeDifferences.months}
                </div>
                <div className={styles.timeItem}>
                    Weeks: {timeDifferences.weeks}
                </div>
                <div className={styles.timeItem}>
                    Days: {timeDifferences.days}
                </div>
                <div className={styles.timeItem}>
                    Hours: {timeDifferences.hours}
                </div>
                <div className={styles.timeItem}>
                    Minutes: {timeDifferences.minutes}
                </div>
                <div className={styles.timeItem}>
                    Seconds: {timeDifferences.seconds}
                </div>
            </div>
        </div>
    );
}