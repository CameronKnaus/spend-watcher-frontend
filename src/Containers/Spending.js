import React from 'react';
import styles from 'Styles/Containers/Spending.module.css';
import useContent from 'CustomHooks/useContent';
import ActionTile from 'Components/Tiles/ActionTile';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import DashboardButton from 'Components/Dashboard/DashboardButton';
import TransactionForm from 'Components/Transactions/TransactionForm';
import { useNavigate } from 'react-router';
import { PAGE_ROUTES } from '../Constants/RouteConstants';

export default function Spending({ refreshRequested, callForRefresh }) {
    const getContent = useContent('SPENDING');
    const currentMonth = React.useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);

    const [spendingTotal, setSpendingTotal] = React.useState('$0.00');
    const [logPanelOpen, setLogPanelOpen] = React.useState(false);

    const service = useFetch(SERVICE_ROUTES.spendingSummary, true);
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!service.response) {
            return;
        }

        const { spending } = service.response;
        setSpendingTotal(`$${spending.currentMonthTotal}`);
    }, [service.response]);

    React.useEffect(() => {
        if(refreshRequested) {
            service.fire(true);
        }
    }, [refreshRequested, service]);

    if(service.error) {
        return JSON.stringify(service.error);
    }

    return (
        <div className={styles.spendingContainer}>
            <h2 className={`header-text ${styles.title}`}>
                {getContent('MY_SPENDING')}
            </h2>
            <ActionTile useShadow
                        title={getContent('MONTHLY_DISCRETIONARY')}
                        subtitle={getContent('MONTH_TOTAL', [currentMonth])}
                        value={spendingTotal}
                        ariaValue={getContent('SPENT_ARIA_LABEL', [spendingTotal, currentMonth])}
                        actionPrompt={getContent('SEE_TRENDS')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
                        callback={() => navigate(PAGE_ROUTES.spendingSummary)}
                        isLoading={service.loading}
            />
            <ActionTile isInactive
                        title={getContent('RECURRING')}
                        fallbackDescription={getContent('NO_RECURRING')}
                        fallbackActionPrompt={getContent('NO_RECURRING_PROMPT')}
                        ariaValue={getContent('RECURRING_ARIA_LABEL', [0])}
                        actionPrompt={getContent('ADJUST_RECURRING')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
                        isLoading={service.loading}
            />
            <DashboardButton buttonColor='var(--theme-red-dark)'
                             text={getContent('LOG_EXPENSE')}
                             callback={() => setLogPanelOpen(true)}
                             isDisabled={service.loading}
            />
            {
                logPanelOpen && <TransactionForm onPanelClose={() => setLogPanelOpen(false)} onSubmission={callForRefresh} />
            }
        </div>
    );
}