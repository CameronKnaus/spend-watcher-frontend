import styles from './Dashboard.module.css';
import { format } from 'date-fns';
import MonthsSpendingHighlights from './MonthsSpendingHighlights/MonthsSpendingHighlights';
import CustomButton from 'Components/CustomButton/CustomButton';

export default function Dashboard() {
    const currentMonth = format(new Date(), 'LLLL');
    return (
        <div className={styles.dashboard}>
            <h2 className={styles.spendingSectionTitle}>{`${currentMonth} Spending`}</h2>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        <MonthsSpendingHighlights />
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <CustomButton
                        className={styles.expenseButton}
                        text="Log Expense"
                        layout={'full-width'}
                        onClick={() => {}}
                    />
                </div>
            </div>
        </div>
    );
}
