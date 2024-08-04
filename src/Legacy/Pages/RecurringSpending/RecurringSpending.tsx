import styles from './RecurringSpending.module.css';
import useContent from 'CustomHooks/useContent';
import LabelAndValueBox from 'Components/UIElements/DataVisualization/LabelAndValueBox/LabelAndValueBox';
import RecurringExpensesList from 'Components/RecurringSpending/RecurringExpensesList/RecurringExpensesList';
import { useEffect, useMemo, useState } from 'react';
import NavigationalBanner from 'Components/UIElements/Navigation/NavigationalBanner/NavigationalBanner';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import formatCurrency from '../../Util/Formatters/formatCurrency';
import Alert from '../../Components/UIElements/Informational/Alert/Alert';
import { useQuery } from '@tanstack/react-query';
import { recurringSpendingQueryKey } from 'Util/QueryKeys';
import axios from 'axios';
import recurringSpendingTransform from './recurringSpendingTransform';
import { RecurringTransaction } from 'Types/TransactionTypes';


export default function RecurringSpending() {
    const currentMonth = useMemo(() => {
        const currentDate = new Date();
        return currentDate.toLocaleString('default', { month: 'long' });
    }, []);
    const getContent = useContent('RECURRING_SPENDING');
    const [recurringTransactionsList, setRecurringTransactionsList] = useState<Array<RecurringTransaction>>([]);
    const [actualMonthTotal, setActualMonthTotal] = useState(0);
    const [estimatedMonthTotal, setEstimatedMonthTotal] = useState(0);
    const [hasVariableRecurring, setHasVariableRecurring] = useState(false);

    const { isLoading, data: response } = useQuery({
        queryKey: [
            recurringSpendingQueryKey
        ],
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.getAllRecurringExpenses);
        },
        select: recurringSpendingTransform
    });

    useEffect(() => {
        if(!response) {
            return;
        }

        setRecurringTransactionsList(response.recurringTransactions);
        setActualMonthTotal(response.actualMonthTotal);
        setEstimatedMonthTotal(response.estimatedMonthTotal);
        setHasVariableRecurring(response.hasVariableRecurring);
    }, [response]);

    const estimateVariance = response?.estimateVariance ?? 0;
    const changeLabel = getContent(estimateVariance > 0 ? 'VALUE_CHANGE_OVERSPENT' : 'VALUE_CHANGE_SAVED');
    const hasNoExpenses = Boolean(response?.noTransactions);
    return (
        <>
            <NavigationalBanner title={getContent('PAGE_TITLE')} />
            <div className={styles.container}>
                { !hasNoExpenses && (hasVariableRecurring ? (
                    <>
                        <div className={styles.totalContainer}>
                            <LabelAndValueBox isLoading={isLoading}
                                              value={`-${formatCurrency(estimatedMonthTotal ?? 0)}`}
                                              label={getContent('TOTAL')}
                            />
                        </div>
                        <div className={styles.totalContainer}>
                            <LabelAndValueBox isLoading={isLoading}
                                              value={`-${formatCurrency(actualMonthTotal ?? 0)}`}
                                              valueChange={response?.estimateVariance}
                                              valueChangeLabel={changeLabel}
                                              label={getContent('TOTAL_ACTUAL', [currentMonth])}
                            />
                        </div>
                    </>
                    ) : (
                        <div className={styles.totalContainer}>
                            <LabelAndValueBox isLoading={isLoading}
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
                <RecurringExpensesList hasNoExpenses={hasNoExpenses} isLoading={isLoading} transactionList={recurringTransactionsList} />
            </div>
        </>
    );
}