import React from 'react';
import styles from './RecentTransactions.module.css';
import useContent from 'CustomHooks/useContent';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import Link from 'Components/UIElements/Navigation/Link/Link';
import { PAGE_ROUTES } from 'Constants/RouteConstants';
import TransactionsList from '../../Components/Transactions/TransactionsList/TransactionsList';

export default function RecentTransactions({ refreshRequested, callForRefresh }) {
    const service = useFetch(SERVICE_ROUTES.recentTransactions, true);
    const getContent = useContent();
    const text = (key) => getContent('TRANSACTIONS', key);

    const Container = React.useCallback(({ children }) => {
        return (
            <div className={styles.recentTransactionsContainer}>
                <h2 className={`header-text ${styles.title}`}>
                    {getContent('TRANSACTIONS', 'RECENT')}
                </h2>
                {children}
            </div>
        );
    }, [getContent]);

    React.useEffect(() => {
        if(refreshRequested) {
            // If refresh is requested then silently make a new service request
            service.fire(true);
        }
    }, [refreshRequested, service]);

    if(service.error) {
        // TODO: Proper Error Handling
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

    return (
        <Container>
            <TransactionsList isLoading={service.loading}
                              transactionsList={service?.response?.transactions}
                              onEditCallback={callForRefresh}
            />
            <Link useChevron
                  text={text('VIEW_ALL')}
                  route={PAGE_ROUTES.spendingHistory}
                  customClass={styles.linkContainer}
                  textAlign='center'
            />
        </Container>
    );
}