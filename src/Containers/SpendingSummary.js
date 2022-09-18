import TopSpendingCategories from '../Components/SpendingBreakdown/TopSpendingCategories';
import styles from '../Styles/Containers/SpendingSummary.module.css';
import useContent from '../CustomHooks/useContent';
import formatCurrency from '../Util/formatCurrency';

export default function SpendingSummary({ spendingBreakdown, setCurrentTab, setFilterCategory, totalTransactionsPerCategory }) {
    const getContent = useContent('SPENDING_BREAKDOWN');

    return (
        <div className={styles.contentContainer}>
            <div className={styles.totalSpentContainer}>
                <div className={styles.totalLabel}>
                    {getContent('TOTAL_SPENT')}
                </div>
                <div className={styles.totalValue}>
                    {`-${formatCurrency(spendingBreakdown.finalTotalSpent)}`}
                </div>
            </div>
            <div className={styles.topCategories}>
                <TopSpendingCategories useDollarValues
                                       label={getContent('CATEGORY_TOTAL_TITLE')}
                                       categoryTotals={spendingBreakdown.categoryTotals}
                                       setCurrentTab={setCurrentTab}
                                       setFilterCategory={setFilterCategory}
                />
            </div>
            <div className={styles.topCategories}>
                <TopSpendingCategories label={getContent('CATEGORY_TOTAL_AMOUNT_TITLE')}
                                       categoryTotals={totalTransactionsPerCategory}
                                       setCurrentTab={setCurrentTab}
                                       setFilterCategory={setFilterCategory}
                />
            </div>
        </div>
    );
}