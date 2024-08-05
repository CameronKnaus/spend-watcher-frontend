import styles from './Dashboard.module.css';
import { format } from 'date-fns';
import MonthsSpendingHighlights from './MonthsSpendingHighlights/MonthsSpendingHighlights';

export default function Dashboard() {
    const currentMonth = format(new Date(), 'LLLL');
    return (
        <div className={styles.dashboard}>
            <h2 className={styles.spendingSectionTitle}>{`${currentMonth} Spending`}</h2>
            <div className={styles.spendingGrid}>
                <MonthsSpendingHighlights />
            </div>
        </div>
    );
}
