import React from 'react';
import styles from '../../Styles/Components/Dashboard/FinanceStats.module.css';
import formatNumber from "../../Util/formatNumber";
import msMapper from "../../Util/TimeMapping";

const NICOTINE_COST_PER_MINUTE = 0.0017847222;

const calculateInvestmentGains = function(principle, yearsInvested) {
    // estimating 40 years of 7% stock market gains
    let total = principle;
    for(let i = 0; i < yearsInvested; ++i) {
        total = total * 1.07;
    }

    return total.toFixed(2);
}

const YEARS_INVESTED = [1, 2, 3, 5, 10, 20, 30, 40];

export default function FinanceStats({lastRelapseTimestamp}) {
    const lastRelapseDate = new Date(lastRelapseTimestamp);
    const currentTime = new Date();

    const timeSinceRelapse = Math.abs(currentTime - lastRelapseDate);
    const minutes = Math.floor(timeSinceRelapse / msMapper.minute);
    const savings = (minutes * NICOTINE_COST_PER_MINUTE).toFixed(2);

    return (
        <div className={styles.statContainer}>
            <div className={styles.title}>Money Saved</div>
            <div className={styles.statItem}>
                <span>
                    Money Saved:
                </span>
                <span className={styles.numberItem}>
                    ${formatNumber(savings)}
                </span>
            </div>
            {
                YEARS_INVESTED.map((yearsInvested) => (
                    <div className={styles.statItem} key={yearsInvested}>
                        <span className={styles.smallStat}>
                            If Invested {yearsInvested}yrs (est):
                        </span>
                                <span className={styles.numberItem}>
                            ${formatNumber(calculateInvestmentGains(savings, yearsInvested))}
                        </span>
                    </div>
                ))
            }
        </div>
    )
}