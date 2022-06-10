import React from 'react';
import styles from '../Styles/Containers/RecentTransactions.module.css';
import useContent from '../CustomHooks/useContent';
import SERVICE_ROUTES from '../Constants/ServiceRoutes';
import useFetch from '../CustomHooks/useFetch';
import Transaction from '../Components/Transactions/Transaction';
import Link from '../Components/UIElements/Link';
import { PAGE_ROUTES } from '../Constants/RouteConstants';

export default function RecentTransactions({ refreshRequested }) {
    const service = useFetch(SERVICE_ROUTES.recentTransactions, true);
    const getContent = useContent();
    const text = (key) => getContent('TRANSACTIONS', key);

    const Container = React.useCallback(({ children }) => {
        return (
            <>
                <h2 className={`header-text ${styles.title}`}>
                    {getContent('TRANSACTIONS', 'RECENT')}
                </h2>
                {children}
            </>
        );
    }, [getContent]);

    React.useEffect(() => {
        if(refreshRequested) {
            // If refresh is requested then silently make a new service request
            service.fire(true);
        }
    }, [refreshRequested, service]);

    if(service.loading) {
        // TODO
        return (
            <Container>
                LOADING
            </Container>
        );
    }

    if(service.error) {
        // TODO Proper Error Handling
        return (
            <Container>
                <div className={styles.issueMessage}>
                    {text('ERROR')}
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(service.error, null, 2)}
                </pre>
            </Container>
        );
    }

    if(service.response.data.noTransactions) {
        return (
            <Container>
                <div className={styles.issueMessage}>
                    {text('NO_TRANSACTIONS')}
                </div>
            </Container>
        );
    }

    const mapTransactionList = (transactionList, header) => {
        const sortedList = transactionList.sort((a, b) => {
            return a.transaction_id < b.transaction_id ? 1 : -1;
        });

        return (
            <>
                <h3 className={styles.dateLabel}>
                    {header}
                </h3>
                {
                    sortedList.map((transaction) => (
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
    };

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
        <Container>
            {
                today && mapTransactionList(today, getContent('GENERAL', 'TODAY'))
            }
            {
                yesterday && mapTransactionList(yesterday, getContent('GENERAL', 'YESTERDAY'))
            }
            {
                transactions && transactionGroupings()
            }
            <Link useChevron
                  text={text('VIEW_ALL')}
                  route={PAGE_ROUTES.transactionSummary}
                  customClass={styles.linkContainer}
                  textAlign='center'
            />
        </Container>
    );
}