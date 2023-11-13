import { useState } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './TransactionsList.module.css';
import TransactionForm from '../TransactionForm/TransactionForm';
import dayjs from 'dayjs';
import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';
import RecurringSpendSlideInPanel from 'Components/RecurringSpending/RecurringSpendSlideInPanel/RecurringSpendSlideInPanel';
import { SpendingCategoryType } from 'Constants/categories';
import { FormattedTransaction, RecurringTransaction, SpendingBreakdownTransaction, TransactionList, TransactionListDiscretionary, TransactionListTransaction } from 'Types/TransactionTypes';
import { DateType } from 'Types/DateTypes';

/* TransactionsList prop should be transactions grouped by date with they date being the key:
    Example:
           transactionsList = {
                01/02/2022: [{ *transaction data* }, { *transaction data* }]
                01/01/2022: [{ *transaction data* }, { *transaction data* }]
* */
type TransactionListPropTypes = {
    transactionsList?: TransactionList | Record<DateType, Array<SpendingBreakdownTransaction>>,
    filteredCategory?: SpendingCategoryType | '',
    isLoading?: boolean,
    skeletonLoaderCount?: number
}

export default function TransactionsList({ transactionsList, filteredCategory, isLoading = false, skeletonLoaderCount = 5 }: TransactionListPropTypes) {
    const [transactionToEdit, setTransactionToEdit] = useState<FormattedTransaction | null>(null);
    const [recurringTransactionToEdit, setRecurringTransactionToEdit] = useState<RecurringTransaction | SpendingBreakdownTransaction | null>(null);
    const getContent = useContent('TRANSACTIONS');
    const getGeneralContent = useContent('GENERAL');
    const getCategoryContent = useContent('SPENDING_CATEGORIES');

    if(isLoading) {
        return <LoadingInteractiveRowList id='loading-transaction' rowCount={skeletonLoaderCount} rowSpacing={12} />;
    }

    if(!transactionsList) {
        return (
            <div className={styles.issueMessage}>
                {getContent('NO_TRANSACTIONS')}
            </div>
        );
    }

    function setTransactionForEditing(transaction: TransactionListDiscretionary) {
        setTransactionToEdit({
            id: transaction.transactionId,
            amount: transaction.amount,
            note: transaction.note,
            category: transaction.category,
            isUncommon: transaction.isUncommon,
            date: transaction.date,
            linkedTripId: transaction.linkedTripId
        });
    }

    // Maps out all transactions under a given grouping (i.e. under a single date)
    function mapTransactionList(transactionList: Array<TransactionListTransaction | SpendingBreakdownTransaction>, header: string) {
        let sortedList = transactionList.sort((a, b) => {
            return a.transactionId! < b.transactionId! ? 1 : -1;
        });

        if(filteredCategory) {
            sortedList = sortedList.filter(transaction => transaction.category === filteredCategory);
        }

        if(!sortedList.length) {
            return null;
        }

        return (
            <>
                <h3 className={styles.dateLabel}>
                    {header}
                </h3>
                {
                    sortedList.map((transaction) => (
                        <div key={transaction.transactionId}
                             className={styles.transactionWrapper}
                        >
                            {transaction.isRecurringTransaction ? (
                                <InteractiveDataRow isExpense
                                                    showRevolvingIcon
                                                    title={getCategoryContent(transaction.category)}
                                                    iconCategory={transaction.category}
                                                    description={transaction.expenseName}
                                                    amount={transaction.amount}
                                                    amountDescription={dayjs(transaction.date).format('MMMM')}
                                                    onClick={() => {
                                                        setRecurringTransactionToEdit(transaction);
                                                    }}
                                />
                            ) : (
                                <InteractiveDataRow isExpense
                                                    title={getCategoryContent(transaction.category)}
                                                    iconCategory={transaction.category}
                                                    description={transaction.note}
                                                    amount={transaction.amount}
                                                    amountDescription={transaction.date}
                                                    onClick={() => setTransactionForEditing(transaction)}
                                />
                            )}
                        </div>
                    ))
                }
            </>
        );
    }

    function transactionGroupings() {
        const renderList = [];
        for(const dateKey in transactionsList) {
            const isToday = dateKey === dayjs().format('MM/DD/YY');
            const isYesterday = dateKey === dayjs().add(-1, 'day').format('MM/DD/YY');

            let groupLabel = dateKey;
            if(isToday) {
                groupLabel = getGeneralContent('TODAY');
            } else if(isYesterday) {
                groupLabel = getGeneralContent('YESTERDAY');
            }

            const mappedTransactionList = mapTransactionList(transactionsList[dateKey as DateType], groupLabel);
            if(mappedTransactionList) {
                renderList.push(
                    <div key={dateKey}>
                        { mappedTransactionList }
                    </div>
                );
            }
        }

        if(!renderList.length) {
            return (
                <div className={styles.noTransactions}>
                    {getContent('NO_TRANSACTIONS_FOUND')}
                </div>
            );
        }

        return renderList;
    }

    return (
        <>
            { transactionsList && transactionGroupings() }
            {
                transactionToEdit && (
                    <TransactionForm editMode
                                     existingTransaction={transactionToEdit}
                                     onPanelClose={() => setTransactionToEdit(null)}
                    />
                )
            }
            {
                recurringTransactionToEdit && (
                    <RecurringSpendSlideInPanel editMode
                                                existingTransaction={recurringTransactionToEdit as RecurringTransaction}
                                                onPanelClose={() => setRecurringTransactionToEdit(null)}
                    />
                )
            }
        </>
    );
}