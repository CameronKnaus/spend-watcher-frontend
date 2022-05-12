import React from 'react';
import styles from '../Styles/Containers/RecentTransactions.module.css';
import getContent from '../Util/getContent';
import SERVICE_ROUTES from '../Constants/ServiceRoutes';
import useFetch from '../CustomHooks/useFetch';
import Transaction from '../Components/UIElements/Transaction';

export default function RecentTransactions() {
    const service = useFetch(SERVICE_ROUTES.recentTransactions, true);
    const text = (key) => getContent('TRANSACTIONS', key);

    if(service.loading) {
        return 'LOADING';
    }

    if(service.error) {
        return JSON.stringify(service.error);
    }

    const mapTransactionList = (transactionList, header) => (
        <>
            <h3 className={styles.dateLabel}>
                {header}
            </h3>
            {
                transactionList.map((transaction) => (
                    <div key={transaction.transaction_id}
                         className={styles.transactionWrapper}
                    >
                        <Transaction category={transaction.category}
                                     description={transaction.note}
                                     amount={transaction.amount}
                                     date={transaction.date}
                        />
                    </div>
                ))
            }
        </>
    );

    if(service.response.data.noTransactions) {
        // TODO
        return 'No Transactions';
    }

    const { today, yesterday, ...transactions } = service.response.data.transactions;

    // For transactions that aren't "today" or "yesterday"
    const transactionGroupings = () => {
        const renderList = [];
        for(const key in transactions) {
            const dateString =  new Date(key).toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            });
            renderList.push(
                <div key={dateString}>
                    { mapTransactionList(transactions[key], dateString) }
                </div>
            );
        }

        return renderList;
    };


    return (
        <>
            <h2 className={`header-text ${styles.title}`}>
                {text('RECENT')}
            </h2>
            {
                today && mapTransactionList(today, getContent('GENERAL', 'TODAY'))
            }
            {
                yesterday && mapTransactionList(yesterday, getContent('GENERAL', 'YESTERDAY'))
            }
            {
                transactions && transactionGroupings()
            }
        </>
    );
}