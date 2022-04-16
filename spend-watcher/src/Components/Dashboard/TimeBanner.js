import React from 'react';
import styles from '../../Styles/Components/Dashboard/TimeBanner.module.css';
import getTimeBetweenDates from "../../Util/getTimeBetweenDates";

export default function TimeBanner({lastRelapseTimestamp, userCrux, refreshButton}) {
    if(!lastRelapseTimestamp) {
        return null;
    }

    const lastRelapseDate = new Date(lastRelapseTimestamp);
    const timeDifferences = getTimeBetweenDates(lastRelapseDate);

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className={styles.headerContainer}>
            <button className={styles.refreshButton} onClick={refreshButton}>&#x21bb;</button>
            <div className={styles.title}>Time Free of {userCrux}</div>
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
            <div className={styles.timeSince}>
                You've been {userCrux} free since<br/> {lastRelapseDate.toLocaleTimeString('en-US', dateOptions)}
            </div>
        </div>
    );
}