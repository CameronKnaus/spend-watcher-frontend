import styles from './SpendingHistory.module.css';
import TransactionsList from '../../Components/Transactions/TransactionsList/TransactionsList';
import SpendCategoryFilter from '../../Components/SpendingHistory/SpendCategoryFilter/SpendCategoryFilter';
import useContent from '../../CustomHooks/useContent';
import { useIsMobile } from '../../Util/IsMobileContext';
import { DateType } from 'Types/DateTypes';
import { SpendingBreakdownTransaction } from 'Types/TransactionTypes';
import { SpendingCategoryType } from 'Constants/categories';
import { Dispatch, SetStateAction } from 'react';

type SpendingHistoryPropTypes = {
    transactionsList: Record<DateType, Array<SpendingBreakdownTransaction>>,
    filterCategory: SpendingCategoryType | '',
    setFilterCategory: Dispatch<SetStateAction<SpendingCategoryType | ''>>,
    totalTransactionsPerCategory: Record<SpendingCategoryType, number>,
    finalTotalTransactions: number,
    noTransactions?: boolean;
}

export default function SpendingHistory({
    transactionsList,
    filterCategory,
    setFilterCategory,
    totalTransactionsPerCategory,
    finalTotalTransactions,
    noTransactions
}: SpendingHistoryPropTypes) {
    const getContent = useContent('SPENDING_BREAKDOWN');
    const isMobile = useIsMobile();

    const transactionCount = filterCategory ? totalTransactionsPerCategory[filterCategory] : finalTotalTransactions;
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
                            <SpendCategoryFilter setFilterCategory={setFilterCategory}
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
                                      filteredCategory={filterCategory}
                    />
                </div>
            </div>
        </>
    );
}