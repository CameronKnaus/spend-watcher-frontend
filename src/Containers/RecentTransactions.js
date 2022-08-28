import React from 'react';
import styles from 'Styles/Containers/RecentTransactions.module.css';
import useContent from 'CustomHooks/useContent';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import Link from 'Components/UIElements/Navigation/Link';
import { PAGE_ROUTES } from 'Constants/RouteConstants';
import TransactionsList from '../Components/UIElements/TransactionsList';

export default function RecentTransactions({ refreshRequested, callForRefresh }) {
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

    return (
        <Container>
            <TransactionsList transactionsList={service.response.transactions} onEditCallback={callForRefresh} />
            <Link useChevron
                  text={text('VIEW_ALL')}
                  route={PAGE_ROUTES.spendingHistory}
                  customClass={styles.linkContainer}
                  textAlign='center'
            />
        </Container>
    );
}