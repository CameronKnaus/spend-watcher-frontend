import LabelAndValueBox from 'Components/UIElements/DataVisualization/LabelAndValueBox/LabelAndValueBox';
import styles from './Spending.module.css';
import useContent from 'CustomHooks/useContent';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import msMapper from 'Util/Time/TimeMapping';
import { useQuery } from '@tanstack/react-query';
import { spendingSummaryQueryKey } from 'Util/QueryKeys';
import formatCurrency from 'Util/Formatters/formatCurrency';
import { useMemo } from 'react';
import ActionTile from 'Components/Tiles/ActionTile/ActionTile';
import spendingTransform from './spendingTransform';
import { useNavigate } from 'react-router';
import { PAGE_ROUTES } from 'Constants/RouteConstants';

export default function Spending() {
    const getContent = useContent('SPENDING');
    const navigate = useNavigate();
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

    const spendingTotal = spendingData?.spending.currentMonthTotal || 0;

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
        </div>
    );
}