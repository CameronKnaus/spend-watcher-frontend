import React from 'react';
import styles from '../../Styles/Components/Dashboard/FunStats.module.css';
import formatNumber from "../../Util/formatNumber";
import msMapper from "../../Util/TimeMapping";

export default function FunStats({crux, lastRelapseTimestamp}) {
    const lastRelapseDate = new Date(lastRelapseTimestamp);
    const currentTime = new Date();

    const timeSinceRelapse = Math.abs(currentTime - lastRelapseDate);
    const months = Math.floor(timeSinceRelapse / msMapper.month);
    const days = Math.floor(timeSinceRelapse / msMapper.day);
    const hours = Math.floor(timeSinceRelapse / msMapper.hour);
    const minutes = Math.floor(timeSinceRelapse / msMapper.minute);
    const seconds = Math.floor(timeSinceRelapse / msMapper.second);

    return (
        <div className={styles.statContainer}>
            <div className={styles.title}>Fun Stats</div>
            <div className={styles.statItem}>
                <span>
                    Months Free of {crux}:
                </span>
                <span className={styles.numberItem}>
                    {formatNumber(months)}
                </span>
            </div>
            <div className={styles.statItem}>
                <span>
                    Weeks Free of {crux}:
                </span>
                <span className={styles.numberItem}>
                    {formatNumber(Math.floor(days / 7))}
                </span>
            </div>
            <div className={styles.statItem}>
                <span>
                    Days Free of {crux}:
                </span>
                <span className={styles.numberItem}>
                    {formatNumber(days)}
                </span>
            </div>
            <div className={styles.statItem}>
                <span>
                    Hours Free of {crux}:
                </span>
                <span className={styles.numberItem}>
                    {formatNumber(hours)}
                </span>
            </div>
            <div className={styles.statItem}>
                <span>
                    Minutes Free of {crux}:
                </span>
                <span className={styles.numberItem}>
                    {formatNumber(minutes)}
                </span>
            </div>
            <div className={styles.statItem}>
                <span>
                    Seconds Free of {crux}:
                </span>
                <span className={styles.numberItem}>
                    {formatNumber(seconds)}
                </span>
            </div>
        </div>
    )
}