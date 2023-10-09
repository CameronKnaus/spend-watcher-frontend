import React from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './MonthlySpendUpdateForm.module.css';
import SlideUpPanel from '../../UIElements/Modal/SlideUpPanel/SlideUpPanel';
import axios from 'axios';
import MoneyInput from 'Components/UIElements/Form/MoneyInput/MoneyInput';
import CategoryIcon from 'Components/UIElements/VisualOnlyElements/CategoryIcon/CategoryIcon';
import formatCurrency from 'Util/Formatters/formatCurrency';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { recurringTransactionDependentQueryKeys } from 'Util/QueryKeys';
import { RecurringTransaction } from 'Types/TransactionTypes';
import { EmptyCallback } from 'Types/QoLTypes';
import { SpendingCategoryType } from 'Constants/categories';

type MonthlySpendUpdateFormPropTypes = {
    onPanelClose: EmptyCallback;
    expenseToUpdate: RecurringTransaction;
    currentMonthName: string;
}

export default function MonthlySpendUpdateForm({ onPanelClose, expenseToUpdate, currentMonthName }: MonthlySpendUpdateFormPropTypes) {
    const getContent = useContent('RECURRING_SPENDING');
    const queryClient = useQueryClient();

    // State for form values
    const [spendAmount, setSpendAmount] = React.useState<number | null>(null);

    function submit() {
        if(spendAmount == null) {
            return;
        }

        const payload = {
            recurringSpendId: expenseToUpdate.recurringSpendId,
            amountSpent: Number(spendAmount),
            transactionId: expenseToUpdate.transactionId,
            date: dayjs(new Date()).format('YYYY-MM'),
            isRevision: false
        };

        // Handle service call
        axios.post(SERVICE_ROUTES.updateRecurringExpense, payload).then(() => {
            queryClient.invalidateQueries(recurringTransactionDependentQueryKeys);
        });
    }

    const estimatedMonthlyAmount = expenseToUpdate.estimatedAmount;
    const amountDifference = (spendAmount || 0) - estimatedMonthlyAmount;
    const amountDifferencePercent = ((amountDifference / estimatedMonthlyAmount) * 100).toFixed(2);
    const spentMore = amountDifference > 0;
    const changeSign = spentMore ? '+' : '';
    const valueMatchesOriginal = !spendAmount || Number(spendAmount) === estimatedMonthlyAmount;
    const amountDifferenceStyle = valueMatchesOriginal ? {} : { color: spentMore ? 'var(--theme-money-loss)' : 'var(--theme-money-gain)' };

    return (
        <SlideUpPanel title={getContent('UPDATE_EXPENSE_FOR_MONTH', [currentMonthName])}
                      closeText={getContent('CANCEL')}
                      confirmText={getContent('SUBMIT')}
                      forwardActionCallback={submit}
                      tagColor='var(--theme-red-dark)'
                      disableConfirmButton={spendAmount == null}
                      onPanelClose={onPanelClose}
        >
            <form className={styles.expenseUpdateForm}>
                <div className={styles.expenseSummary}>
                    {/* TODO: Originally this categoryIcon was receiving a categoryCode of expenseToUpdate.category, but theres a lot of typescript mismatch */}
                    <CategoryIcon categoryCode={SpendingCategoryType.VEHICLE}
                                  containerSize='56px'
                                  iconSize='33px'
                                  customClasses={styles.iconContainer}
                    />
                    <div>
                        <div className={styles.expenseNameLabel}>
                            {expenseToUpdate.expenseName}
                        </div>
                        <div className={styles.expenseAmountLabel}>
                            {getContent('ESTIMATED_AMOUNT', [formatCurrency(estimatedMonthlyAmount)])}
                        </div>
                    </div>
                </div>
                <label>
                    <div className={styles.updateLabel}>
                        {getContent('AMOUNT_SPENT_IN_MONTH', [currentMonthName])}
                    </div>
                    <MoneyInput name='account-value-spent-field'
                                placeholder={formatCurrency(estimatedMonthlyAmount)}
                                className={styles.textInput}
                                stateUpdater={setSpendAmount}
                                value={spendAmount}
                    />
                </label>
                <label>
                    {getContent('AMOUNT_SPENT_COMPARED')}
                </label>
                <div style={amountDifferenceStyle} className={styles.amountDifference}>
                    {
                        valueMatchesOriginal ?
                            '$0.00 (0.00%)'
                         :
                            changeSign + formatCurrency(amountDifference) + ` (${changeSign + amountDifferencePercent}%)`
                    }
                </div>
            </form>
        </SlideUpPanel>
    );
}