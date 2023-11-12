import LabelAndValueBox from 'Components/UIElements/DataVisualization/LabelAndValueBox/LabelAndValueBox';
import styles from './Spending.module.css';
import useContent from 'CustomHooks/useContent';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import msMapper from 'Util/Time/TimeMapping';
import { useQuery } from '@tanstack/react-query';
import { spendingSummaryQueryKey } from 'Util/QueryKeys';
import formatCurrency from 'Util/Formatters/formatCurrency';
import { useMemo, useState } from 'react';
import ActionTile from 'Components/Tiles/ActionTile/ActionTile';
import spendingTransform from './spendingTransform';
import { useNavigate } from 'react-router';
import { PAGE_ROUTES } from 'Constants/RouteConstants';
import ThickActionButton from 'Components/UIElements/Form/ThickActionButton/ThickActionButton';
import TransactionForm from 'Components/Transactions/TransactionForm/TransactionForm';
import RecurringExpensesList from 'Components/RecurringSpending/RecurringExpensesList/RecurringExpensesList';

export default function Spending() {
    const getContent = useContent('SPENDING');
    const navigate = useNavigate();
    const [logPanelOpen, setLogPanelOpen] = useState(false);
    const currentMonth = useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);

    const { isLoading, isError, data: spendingData, error: serviceError } = useQuery({
        queryKey: [
            spendingSummaryQueryKey
        ],
        staleTime: msMapper.day,
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.spendingSummary);
        },
        select: spendingTransform
    });

    if(isError) {
        // TODO: Proper error handling
        return JSON.stringify(serviceError);
    }

    const transactionsRequiringUpdate = spendingData?.recurringSpending?.recurringTransactions?.filter(transaction => transaction.requiresUpdate);
    const spendingTotal = spendingData?.spending.currentMonthTotal || 0;
    const monthlyTotal = spendingData?.recurringSpending?.actualMonthTotal || 0;

    return (
        <div className={styles.spendingContainer}>
            <h2 className={`header-text ${styles.title}`}>
                {getContent('MY_SPENDING')}
            </h2>
            <div className={styles.monthTotalContainer}>
                <LabelAndValueBox secondaryTheme
                                  fontSize={18}
                                  fontWeight='var(--fw-light)'
                                  isLoading={isLoading}
                                  value={`-${formatCurrency(spendingData?.totalSpentThisMonth ?? 0)}`}
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
                        isLoading={isLoading}
            />
            <ActionTile isInactive={spendingData?.recurringSpending.noTransactions}
                        title={getContent('RECURRING')}
                        fallbackDescription={getContent('NO_RECURRING')}
                        fallbackActionPrompt={getContent('NO_RECURRING_PROMPT')}
                        value={`-${formatCurrency(monthlyTotal)}`}
                        ariaValue={getContent('RECURRING_ARIA_LABEL', [monthlyTotal])}
                        actionPrompt={getContent('ADJUST_RECURRING')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
                        callback={() => navigate(PAGE_ROUTES.recurringSpending)}
                        isLoading={isLoading}
            />
            <ThickActionButton buttonColor='var(--theme-red-dark)'
                               text={getContent('LOG_EXPENSE')}
                               callback={() => setLogPanelOpen(true)}
                               isDisabled={isLoading}
            />
            {
                logPanelOpen && <TransactionForm onPanelClose={() => setLogPanelOpen(false)} />
            }
            {
                spendingData?.recurringSpending.monthlyExpenseRequiresUpdate && transactionsRequiringUpdate?.length && (
                    <RecurringExpensesList quickUpdateMode transactionList={transactionsRequiringUpdate} />
                )
            }
        </div>
    );
}