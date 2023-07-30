import React from 'react';
import styles from './Spending.module.css';
import useContent from 'CustomHooks/useContent';
import ActionTile from 'Components/Tiles/ActionTile/ActionTile';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import ThickActionButton from 'Components/UIElements/Form/ThickActionButton/ThickActionButton';
import TransactionForm from 'Components/Transactions/TransactionForm/TransactionForm';
import { useNavigate } from 'react-router';
import { PAGE_ROUTES } from '../../Constants/RouteConstants';
import formatCurrency from 'Util/Formatters/formatCurrency';
import LabelAndValueBox from 'Components/UIElements/DataVisualization/LabelAndValueBox/LabelAndValueBox';
import RecurringExpensesList from 'Components/RecurringSpending/RecurringExpensesList/RecurringExpensesList';
import { invalidateTransactionQueries } from '../../Util/QueryKeys';
import { useQueryClient } from '@tanstack/react-query';

export default function Spending({ refreshRequested, callForRefresh }) {
    const getContent = useContent('SPENDING');
    const currentMonth = React.useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);
    const [logPanelOpen, setLogPanelOpen] = React.useState(false);
    const queryClient = useQueryClient();

    const service = useFetch(SERVICE_ROUTES.spendingSummary, true);
    const navigate = useNavigate();

    React.useEffect(() => {
        if(refreshRequested) {
            service.fire(true);
        }
    }, [refreshRequested, service]);

    if(service.error) {
        return JSON.stringify(service.error);
    }

    const transactionsRequiringUpdate = service.response?.recurringSpending?.recurringTransactions?.filter(transaction => transaction.requiresUpdate);
    const spendingTotal = service.response?.spending?.currentMonthTotal || 0;
    const monthlyTotal = service.response?.recurringSpending?.actualMonthTotal || 0;

    return (
        <div className={styles.spendingContainer}>
            <h2 className={`header-text ${styles.title}`}>
                {getContent('MY_SPENDING')}
            </h2>
            <div className={styles.monthTotalContainer}>
                <LabelAndValueBox secondaryTheme
                                  fontSize={18}
                                  fontWeight='var(--fw-light)'
                                  isLoading={service.loading}
                                  value={`-${formatCurrency(service.response?.totalSpentThisMonth ?? 0)}`}
                                  label={getContent('TOTAL_SPENT_THIS_MONTH', [currentMonth])}
                />
            </div>
            <ActionTile useShadow
                        title={getContent('MONTHLY_DISCRETIONARY')}
                        subtitle={getContent('MONTH_TOTAL', [currentMonth])}
                        value={`-${formatCurrency(spendingTotal)}`}
                        ariaValue={getContent('SPENT_ARIA_LABEL', [spendingTotal, currentMonth])}
                        actionPrompt={getContent('SEE_TRENDS')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
                        callback={() => navigate(PAGE_ROUTES.spendingSummary)}
                        isLoading={service.loading}
            />
            <ActionTile isInactive={service.response?.recurringSpending.noTransactions}
                        title={getContent('RECURRING')}
                        fallbackDescription={getContent('NO_RECURRING')}
                        fallbackActionPrompt={getContent('NO_RECURRING_PROMPT')}
                        value={`-${formatCurrency(monthlyTotal)}`}
                        ariaValue={getContent('RECURRING_ARIA_LABEL', [monthlyTotal])}
                        actionPrompt={getContent('ADJUST_RECURRING')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
                        callback={() => navigate(PAGE_ROUTES.recurringSpending)}
                        isLoading={service.loading}
            />
            <ThickActionButton buttonColor='var(--theme-red-dark)'
                               text={getContent('LOG_EXPENSE')}
                               callback={() => setLogPanelOpen(true)}
                               isDisabled={service.loading}
            />
            {
                logPanelOpen && <TransactionForm onPanelClose={() => setLogPanelOpen(false)} onSubmission={callForRefresh} />
            }
            {
                service.response?.recurringSpending.monthlyExpenseRequiresUpdate && (
                    <RecurringExpensesList quickUpdateMode transactionList={transactionsRequiringUpdate} onSubmission={() => {
                        invalidateTransactionQueries(queryClient);
                        service.fire();
                    }}
                    />
                )
            }
        </div>
    );
}