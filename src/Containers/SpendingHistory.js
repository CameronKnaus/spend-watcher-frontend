import styles from '../Styles/Containers/SpendingHistory.module.css';
import TransactionsList from '../Components/Transactions/TransactionsList';
import SpendCategoryFilter from '../Components/SpendingHistory/SpendCategoryFilter';
import useContent from '../CustomHooks/useContent';
import { useIsMobile } from '../Util/IsMobileContext';

export default function SpendingHistory({
    transactionsList,
    filterCategory,
    setFilterCategory,
    totalTransactionsPerCategory,
    finalTotalTransactions,
    refreshStats = () => { /* NOOP */ },
    noTransactions
}) {
    const getContent = useContent('SPENDING_BREAKDOWN');
    const isMobile = useIsMobile();

    const filteredCategory = filterCategory?.code;
    const transactionCount = filteredCategory ? totalTransactionsPerCategory[filteredCategory] : finalTotalTransactions;
    const transactionsShownText = getContent('TRANSACTION_COUNT', [transactionCount ?? 0]);

    return (
        <>
            {!isMobile && (
                <div className={styles.transactionsLabel}>
                    {getContent('TRANSACTIONS_LIST_LABEL')}
                </div>
            )}
            <div className={styles.transactionsContainer}>
                <div className={styles.horizontalPadding}>
                    {
                        !noTransactions && (
                            <SpendCategoryFilter activeCategory={filterCategory}
                                                 setFilterCategory={setFilterCategory}
                                                 filterCategory={filterCategory}
                                                 textInputStyles={styles.categoryFilter}
                            />
                        )
                    }
                    <div className={noTransactions ? '' : styles.verticalSpacing}>
                        <div className={styles.countLabel}>
                            {transactionsShownText}
                        </div>
                    </div>
                </div>
                <div className={styles.transactionsListContainer}>
                    <TransactionsList transactionsList={transactionsList}
                                      filteredCategory={filterCategory.code}
                                      onEditCallback={refreshStats}
                    />
                </div>
            </div>
        </>
    );
}