import styles from './RecurringSpending.module.css';
import useContent from 'CustomHooks/useContent';
import LabelAndValueBox from 'Components/UIElements/DataVisualization/LabelAndValueBox/LabelAndValueBox';
import RecurringExpensesList from 'Components/RecurringSpending/RecurringExpensesList/RecurringExpensesList';
import { useEffect, useMemo, useState } from 'react';
import NavigationalBanner from 'Components/UIElements/Navigation/NavigationalBanner/NavigationalBanner';
import useFetch from '../../CustomHooks/useFetch';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import formatCurrency from '../../Util/Formatters/formatCurrency';
import Alert from '../../Components/UIElements/Informational/Alert/Alert';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateTransactionQueries } from '../../Util/QueryKeys';


export default function RecurringSpending() {
    const currentMonth = useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);
    const getContent = useContent('RECURRING_SPENDING');
    const [recurringTransactionsList, setRecurringTransactionsList] = useState([]);
    const [actualMonthTotal, setActualMonthTotal] = useState(0);
    const [estimatedMonthTotal, setEstimatedMonthTotal] = useState(0);
    const [hasVariableRecurring, setHasVariableRecurring] = useState(false);
    const queryClient = useQueryClient();

    const { response, loading, fire } = useFetch(SERVICE_ROUTES.getAllRecurringExpenses, true);

    useEffect(() => {
        if(!response) {
            return;
        }

        setRecurringTransactionsList(response.recurringTransactions);
        setActualMonthTotal(response.actualMonthTotal);
        setEstimatedMonthTotal(response.estimatedMonthTotal);
        setHasVariableRecurring(response.hasVariableRecurring);
    }, [response]);

    function onSubmission(shouldShowLoaders) {
        const fireSilently = !shouldShowLoaders;
        invalidateTransactionQueries(queryClient);
        fire(fireSilently);
    }

    const estimateVariance = response?.estimateVariance ?? 0;
    const changeLabel = getContent(estimateVariance > 0 ? 'VALUE_CHANGE_OVERSPENT' : 'VALUE_CHANGE_SAVED');
    const hasNoExpenses = response?.noTransactions;
    return (
        <>
            <NavigationalBanner title={getContent('PAGE_TITLE')} />
            <div className={styles.container}>
                { !hasNoExpenses && (hasVariableRecurring ? (
                    <>
                        <div className={styles.totalContainer}>
                            <LabelAndValueBox isLoading={loading}
                                              value={`-${formatCurrency(estimatedMonthTotal ?? 0)}`}
                                              label={getContent('TOTAL')}
                            />
                        </div>
                        <div className={styles.totalContainer}>
                            <LabelAndValueBox isLoading={loading}
                                              value={`-${formatCurrency(actualMonthTotal ?? 0)}`}
                                              valueChange={response?.estimateVariance}
                                              valueChangeLabel={changeLabel}
                                              label={getContent('TOTAL_ACTUAL', [currentMonth])}
                            />
                        </div>
                    </>
                    ) : (
                        <div className={styles.totalContainer}>
                            <LabelAndValueBox isLoading={loading}
                                              value={`-${formatCurrency(estimatedMonthTotal ?? 0)}`}
                                              label={getContent('MONTHLY_TOTAL')}
                            />
                        </div>
                    )
                )}
                {response?.monthlyExpenseRequiresUpdate && (
                    <div className={styles.alertContainer}>
                        <Alert alertText={getContent('ATTENTION_UPDATE_REQUIRED')} />
                    </div>
                )}
                <RecurringExpensesList hasNoExpenses={hasNoExpenses} isLoading={loading} transactionList={recurringTransactionsList} onSubmission={onSubmission} />
            </div>
        </>
    );
}