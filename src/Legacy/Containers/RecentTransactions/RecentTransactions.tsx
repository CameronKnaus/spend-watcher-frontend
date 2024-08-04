import React from 'react';
import styles from './RecentTransactions.module.css';
import useContent from 'CustomHooks/useContent';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import Link from 'Components/UIElements/Navigation/Link/Link';
import TransactionsList from '../../Components/Transactions/TransactionsList/TransactionsList';
import axios from 'axios';
import { recentTransactionsQueryKey } from 'Util/QueryKeys';
import { useQuery } from '@tanstack/react-query';
import recentTransactionsTransform from './recentTransactionsTransform';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';

export default function RecentTransactions() {
    const {
        isLoading,
        isError,
        data: recentTransactionsResponse,
        error: serviceError,
    } = useQuery({
        queryKey: [recentTransactionsQueryKey],
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.recentTransactions);
        },
        select: recentTransactionsTransform,
    });
    const getContent = useContent('TRANSACTIONS');

    const recentLabel = getContent('RECENT');
    const Container = React.useCallback(
        ({ children }: { children: any }) => {
            return (
                <div className={styles.recentTransactionsContainer}>
                    <h2 className={`header-text ${styles.title}`}>{recentLabel}</h2>
                    {children}
                </div>
            );
        },
        [recentLabel],
    );

    if (isError) {
        // TODO: Proper Error Handling
        return (
            <Container>
                <div className={styles.issueMessage}>{getContent('ERROR')}</div>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(serviceError, null, 2)}
                </pre>
            </Container>
        );
    }

    return (
        <Container>
            <TransactionsList isLoading={isLoading} transactionsList={recentTransactionsResponse?.transactions} />
            <Link
                useChevron
                text={getContent('VIEW_ALL')}
                route={PAGE_ROUTES.transactions}
                customClass={styles.linkContainer}
                textAlign="center"
            />
        </Container>
    );
}
