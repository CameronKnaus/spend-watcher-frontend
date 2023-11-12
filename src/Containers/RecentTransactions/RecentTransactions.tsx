import React from 'react';
import styles from './RecentTransactions.module.css';
import useContent from 'CustomHooks/useContent';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import Link from 'Components/UIElements/Navigation/Link/Link';
import { PAGE_ROUTES } from 'Constants/RouteConstants';
import TransactionsList from '../../Components/Transactions/TransactionsList/TransactionsList';

export default function RecentTransactions() {
    const service = useFetch(SERVICE_ROUTES.recentTransactions, true);
    const getContent = useContent('TRANSACTIONS');


    const recentLabel = getContent('RECENT');
    const Container = React.useCallback(({ children }: { children: any}) => {
        return (
            <div className={styles.recentTransactionsContainer}>
                <h2 className={`header-text ${styles.title}`}>
                    {recentLabel}
                </h2>
                {children}
            </div>
        );
    }, [recentLabel]);

    if(service.error) {
        // TODO: Proper Error Handling
        return (
            <Container>
                <div className={styles.issueMessage}>
                    {getContent('ERROR')}
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
            />
            <Link useChevron
                  text={getContent('VIEW_ALL')}
                  route={PAGE_ROUTES.spendingHistory}
                  customClass={styles.linkContainer}
                  textAlign='center'
            />
        </Container>
    );
}