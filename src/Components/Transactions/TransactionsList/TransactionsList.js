import { useState } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './TransactionsList.module.css';
import TransactionForm from '../TransactionForm/TransactionForm';
import dayjs from 'dayjs';
import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';
import RecurringSpendSlideInPanel from 'Components/RecurringSpending/RecurringSpendSlideInPanel/RecurringSpendSlideInPanel';

/* TransactionsList prop should be transactions grouped by date with they date being the key:
    Example:
           transactionsList = {
                01/02/2022: [{ *transaction data* }, { *transaction data* }]
                01/01/2022: [{ *transaction data* }, { *transaction data* }]
* */
export default function TransactionsList({ transactionsList, onEditCallback = () => { /* NOOP */ }, filteredCategory, isLoading, skeletonLoaderCount = 5 }) {
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [recurringTransactionToEdit, setRecurringTransactionToEdit] = useState(null);
    const getContent = useContent();
    const text = (key, args) => getContent('TRANSACTIONS', key, args);

    if(isLoading) {
        return <LoadingInteractiveRowList id='loading-transaction' rowCount={skeletonLoaderCount} rowSpacing={12} />;
    }

    if(!transactionsList) {
        return (
            <div className={styles.issueMessage}>
                {text('NO_TRANSACTIONS')}
            </div>
        );
    }

    function setTransactionForEditing(transaction) {
        setTransactionToEdit({
            id: transaction.transactionId,
            amount: transaction.amount,
            note: transaction.note,
            category: {
                code: transaction.category,
                name: getContent('SPENDING_CATEGORIES', transaction.category)
            },
            isUncommon: transaction.isUncommon,
            date: transaction.date,
            linkedTripId: transaction.linkedTripId
        });
    }

    function handleRecurringSpendPanelClosure(serviceShouldRefresh) {
        setRecurringTransactionToEdit(null);

        if(serviceShouldRefresh) {
            onEditCallback();
        }
    }

    // Maps out all transactions under a given grouping (i.e. under a single date)
    function mapTransactionList(transactionList, header) {
        let sortedList = transactionList.sort((a, b) => {
            return a.transactionId < b.transactionId ? 1 : -1;
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
                                                    title={getContent('SPENDING_CATEGORIES', transaction.category)}
                                                    iconCategory={transaction.category}
                                                    description={transaction.expenseName}
                                                    amount={transaction.amount}
                                                    amountDescription={dayjs(transaction.date).format('MMMM')}
                                                    onClick={() => {
                                                        setRecurringTransactionToEdit({
                                                            ...transaction,
                                                            category: { code: transaction.category, name: getContent('SPENDING_CATEGORIES', transaction.category) }
                                                        });
                                                    }}
                                />
                            ) : (
                                <InteractiveDataRow isExpense
                                                    title={getContent('SPENDING_CATEGORIES', transaction.category)}
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
                groupLabel = getContent('GENERAL', 'TODAY');
            } else if(isYesterday) {
                groupLabel = getContent('GENERAL', 'YESTERDAY');
            }

            const mappedTransactionList = mapTransactionList(transactionsList[dateKey], groupLabel);
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
                    {text('NO_TRANSACTIONS_FOUND')}
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
                                     onSubmission={onEditCallback}
                    />
                )
            }
            {
                recurringTransactionToEdit && (
                    <RecurringSpendSlideInPanel editMode
                                                existingTransaction={recurringTransactionToEdit}
                                                onPanelClose={handleRecurringSpendPanelClosure}
                                                onSubmission={onEditCallback}
                    />
                )
            }
        </>
    );
}