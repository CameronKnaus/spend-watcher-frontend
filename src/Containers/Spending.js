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
    const currentMonth = React.useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);

    const [spendingTotal, setSpendingTotal] = React.useState('$0.00');
    const [logPanelOpen, setLogPanelOpen] = React.useState(false);

    const service = useFetch(SERVICE_ROUTES.spendingSummary, true);
    const navigate = useNavigate();

    const getContent = useContent();
    const text = (key, args) => getContent('SPENDING', key, args);

    React.useEffect(() => {
        if(!service.response) {
            return;
        }

        const { spending } = service.response.data;
        setSpendingTotal(`$${spending.currentMonthTotal}`);
    }, [service.response]);

    React.useEffect(() => {
        if(refreshRequested) {
            service.fire(true);
        }
    }, [refreshRequested, service]);

    if(service.loading) {
        return 'LOADING';
    }

    if(service.error) {
        return JSON.stringify(service.error);
    }

    return (
        <>
            <h2 className={`header-text ${styles.title}`}>
                {text('MY_SPENDING')}
            </h2>
            <ActionTile useShadow
                        title={text('MONTHLY_DISCRETIONARY')}
                        subtitle={text('MONTH_TOTAL', [currentMonth])}
                        value={spendingTotal}
                        ariaValue={text('SPENT_ARIA_LABEL', [spendingTotal, currentMonth])}
                        actionPrompt={text('SEE_TRENDS')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
                        callback={() => navigate(PAGE_ROUTES.spendingSummary)}
            />
            <ActionTile title={text('RECURRING')}
                        value={null}
                        fallbackDescription={text('NO_RECURRING')}
                        fallbackActionPrompt={text('NO_RECURRING_PROMPT')}
                        ariaValue={text('RECURRING_ARIA_LABEL', [0])}
                        actionPrompt={text('ADJUST_RECURRING')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
            />
            <DashboardButton buttonColor='var(--theme-red-dark)'
                             text={text('LOG_EXPENSE')}
                             callback={() => setLogPanelOpen(true)}
            />
            {
                logPanelOpen && <TransactionForm onPanelClose={() => setLogPanelOpen(false)} onSubmission={callForRefresh} />
            }
        </>
    );
}