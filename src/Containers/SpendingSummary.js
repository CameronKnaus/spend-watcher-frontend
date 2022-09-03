import TopSpendingCategories from '../Components/SpendingBreakdown/TopSpendingCategories';
import styles from '../Styles/Containers/SpendingSummary.module.css';
import useContent from '../CustomHooks/useContent';
import formatCurrency from '../Util/formatCurrency';

export default function SpendingSummary({ spendingBreakdown, setCurrentTab, setFilterCategory }) {
    const getContent = useContent('SPENDING_BREAKDOWN');

    return (
        <div className={styles.contentContainer}>
            <div className={styles.gutter}>
                <div className={styles.totalLabel}>
                    {getContent('TOTAL_SPENT')}
                </div>
                <div className={styles.totalValue}>
                    {`-${formatCurrency(spendingBreakdown.finalTotalSpent)}`}
                </div>
                <TopSpendingCategories categoryTotals={spendingBreakdown.categoryTotals}
                                       setCurrentTab={setCurrentTab}
                                       setFilterCategory={setFilterCategory}
                />
            </div>
        </div>
    );
}