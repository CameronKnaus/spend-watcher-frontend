import React from 'react';
import styles from '../Styles/Containers/Spending.module.css';
import getContent from '../Util/getContent';
import ActionTile from '../Components/Tiles/ActionTile';
import SERVICE_ROUTES from '../Constants/ServiceRoutes';
import useFetch from '../CustomHooks/useFetch';
import DashboardButton from '../Components/UIElements/DashboardButton';

export default function Spending() {
    const currentMonth = React.useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);

    const [spendingTotal, setSpendingTotal] = React.useState('$0.00');

    const service = useFetch(SERVICE_ROUTES.spendingSummary, true);
    const text = (key, args) => getContent('SPENDING', key, args);

    React.useEffect(() => {
        if(!service.response) {
            return;
        }

        const { spending } = service.response.data;
        setSpendingTotal(`$${spending.currentMonthTotal}`);
    }, [service.response]);

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
            />
            <ActionTile title={text('RECURRING')}
                        value={0}
                        fallbackDescription={text('NO_RECURRING')}
                        fallbackActionPrompt={text('NO_RECURRING_PROMPT')}
                        ariaValue={text('RECURRING_ARIA_LABEL', [0])}
                        actionPrompt={text('ADJUST_RECURRING')}
                        options={{ valueColor: 'var(--theme-money-loss)' }}
            />
            <DashboardButton buttonColor='var(--theme-red-dark)'
                             text={text('LOG_EXPENSE')}
            />
        </>
    );
}