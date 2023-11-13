import TopSpendingCategories from 'Components/SpendingBreakdown/TopSpendingCategories/TopSpendingCategories';
import styles from './SpendingSummary.module.css';
import useContent from 'CustomHooks/useContent';
import formatCurrency from 'Util/Formatters/formatCurrency';
import clsx from 'clsx';
import { SpendingCategoryType } from 'Constants/categories';
import { Dispatch, SetStateAction } from 'react';
import { RawSpendingBreakdownResponse } from 'CustomHooks/ServiceHooks/spendingBreakdownTransform';
import { TAB_ENUM } from 'Pages/SpendingBreakdown/SpendingBreakdown';

type SpendingSummaryPropTypes = {
    spendingBreakdown: RawSpendingBreakdownResponse,
    setCurrentTab: Dispatch<SetStateAction<TAB_ENUM>>,
    setFilterCategory: (name: SpendingCategoryType) => void;
    totalTransactionsPerCategory: Record<SpendingCategoryType, number>;
}

export default function SpendingSummary({ spendingBreakdown, setCurrentTab, setFilterCategory, totalTransactionsPerCategory }: SpendingSummaryPropTypes) {
    const getContent = useContent('SPENDING_BREAKDOWN');

    if(spendingBreakdown.noTransactions) {
        return (
            <div className={clsx(styles.contentContainer, styles.noTransactionsLabel)}>
                {getContent('NO_TRANSACTIONS')}
            </div>
        );
    }

    return (
        <div className={styles.contentContainer}>
            <div className={styles.totalsGroup}>
                <div className={styles.totalSpentContainer}>
                    <div className={styles.totalLabel}>
                        {getContent('TOTAL_SPENT')}
                    </div>
                    <div className={styles.totalValue}>
                        {`-${formatCurrency(spendingBreakdown.finalTotalSpent)}`}
                    </div>
                </div>
                <div className={styles.totalSpentContainer}>
                    <div className={styles.totalLabel}>
                        {getContent('TOTAL_DISCRETIONARY')}
                    </div>
                    <div className={styles.totalValue}>
                        {`-${formatCurrency(spendingBreakdown.discretionaryTotal)}`}
                    </div>
                </div>
                <div className={styles.totalSpentContainer}>
                    <div className={styles.totalLabel}>
                        {getContent('TOTAL_RECURRING')}
                    </div>
                    <div className={styles.totalValue}>
                        {`-${formatCurrency(spendingBreakdown.recurringSpendTotal)}`}
                    </div>
                </div>
            </div>
            {
                spendingBreakdown.finalTotalTransactions > 0 && (
                    <>
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
                    </>
                )
            }
        </div>
    );
}