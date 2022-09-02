import TopSpendingCategories from '../Components/SpendingBreakdown/TopSpendingCategories';
import styles from '../Styles/Containers/SpendingSummary.module.css';

export default function SpendingSummary({ categoryTotals }) {

    return (
        <div className={styles.contentContainer}>
            <div className={styles.gutter}>
                <TopSpendingCategories categoryTotals={categoryTotals} />
            </div>
        </div>
    );
}