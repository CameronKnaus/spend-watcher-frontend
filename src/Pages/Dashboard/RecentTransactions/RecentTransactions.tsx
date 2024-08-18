import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import styles from './RecentTransactions.module.css';
import useContent from 'Hooks/useContent';
import useSpendingDetailsService from 'Hooks/useSpendingService';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { TransactionsByDate } from 'Hooks/useSpendingService/useSpendingDetailsService';
import { DbDate } from 'Types/dateTypes';
import TransactionRow from 'Components/TransactionRow';

export default function RecentTransactions() {
    const getContent = useContent('transactions');
    const { data: spendingData } = useSpendingDetailsService();

    // Aim to show 5 recent transactions. However, ensures that all transactions for a given day are shown.
    const applicableTransactionsByDate = useMemo(() => {
        if (!spendingData) {
            return {};
        }

        // Payload to return
        const applicableTransactions: TransactionsByDate = {};

        // The ideal number of transactions to show
        const targetTransactionCount = 5;

        // The absolute maximum number of transactions to show
        const absoluteMaxTransactionCount = 10;

        let index = 0;
        let transactionCount = 0;
        const allDateEntries = Object.entries(spendingData.transactionsByDate);
        while (index < allDateEntries.length && transactionCount <= targetTransactionCount) {
            const [date, dateSpendSummary] = allDateEntries[index];
            const transactionsCountForDate = dateSpendSummary.discretionaryTotal.count;

            // Add date's transactions to transaction count
            const newCount = transactionCount + transactionsCountForDate;

            // If adding the date's transactions would exceed the absolute maximum
            if (newCount > absoluteMaxTransactionCount) {
                // Don't add anymore transactions
                break;
            }

            transactionCount = newCount;
            applicableTransactions[date as DbDate] = dateSpendSummary;

            index++;
        }

        return applicableTransactions;
    }, [spendingData]);

    if (!spendingData) {
        return <h2>Placeholder loading</h2>;
    }

    const lookup = spendingData.transactionDictionary;

    return (
        <ModuleContainer heading={getContent('recent')} className={styles.recentTransactions}>
            {/* Loop through each date group */}
            {Object.entries(applicableTransactionsByDate).map(([dateString, dateSpendSummary]) => {
                const date = parseISO(dateString);
                let dateLabel = format(date, 'MMM do');
                if (isToday(date)) {
                    dateLabel = getContent('todayLabel', [dateLabel]);
                } else if (isYesterday(date)) {
                    dateLabel = getContent('yesterdayLabel', [dateLabel]);
                }

                return (
                    <div key={dateLabel}>
                        <h3 className={styles.dateHeader}>{dateLabel}</h3>
                        <div className={styles.transactionGroup}>
                            {/* Loop through each transaction associated with the given date */}
                            {dateSpendSummary.includedTransactions.map((transactionId) => {
                                const transaction = lookup[transactionId];
                                if (transaction.isRecurring) {
                                    // Don't show recurring transactions in this list
                                    return null;
                                }

                                return (
                                    <TransactionRow
                                        key={transactionId}
                                        transactionId={transactionId}
                                        onClick={() => {}}
                                        category={transaction.category}
                                        amountSpent={transaction.amountSpent}
                                        note={transaction.note}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </ModuleContainer>
    );
}
