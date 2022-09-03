import React from 'react';
import useContent from '../../CustomHooks/useContent';
import styles from '../../Styles/Components/UIElements/TransactionsList.module.css';
import TransactionForm from '../Transactions/TransactionForm';
import dayjs from 'dayjs';
import InteractiveDataRow from './InteractiveDataRow';

/* TransactionsList prop should be transactions grouped by date with they date being the key:
    Example:
           transactionsList = {
                01/02/2022: [{ *transaction data* }, { *transaction data* }]
                01/01/2022: [{ *transaction data* }, { *transaction data* }]
* */
export default function TransactionsList({ transactionsList, onEditCallback = () => { /* NOOP */ }, filteredCategory }) {
    const [transactionToEdit, setTransactionToEdit] = React.useState();
    const getContent = useContent();
    const text = (key) => getContent('TRANSACTIONS', key);

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
            date: transaction.dateISO
        });
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
                            <InteractiveDataRow isExpense
                                                title={getContent('SPENDING_CATEGORIES', transaction.category)}
                                                iconCategory={transaction.category}
                                                description={transaction.note}
                                                amount={transaction.amount}
                                                date={transaction.date}
                                                onClick={() => setTransactionForEditing(transaction)}
                            />
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
        <div>
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
        </div>
    );
}