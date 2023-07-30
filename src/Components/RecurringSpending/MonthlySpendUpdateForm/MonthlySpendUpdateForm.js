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

export default function MonthlySpendUpdateForm({ onPanelClose, onSubmission, expenseToUpdate, currentMonthName }) {
    const getContent = useContent();
    const text = (key, args) => getContent('RECURRING_SPENDING', key, args);

    // State for form values
    const [spendAmount, setSpendAmount] = React.useState(null);

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
        axios.post(SERVICE_ROUTES.updateRecurringExpense, payload).then(onSubmission);
    }

    const estimatedMonthlyAmount = expenseToUpdate.estimatedAmount;
    const amountDifference = spendAmount - estimatedMonthlyAmount;
    const amountDifferencePercent = ((amountDifference / estimatedMonthlyAmount) * 100).toFixed(2);
    const spentMore = amountDifference > 0;
    const changeSign = spentMore ? '+' : '';
    const valueMatchesOriginal = !spendAmount || Number(spendAmount) === estimatedMonthlyAmount;
    const amountDifferenceStyle = valueMatchesOriginal ? {} : { color: spentMore ? 'var(--theme-money-loss)' : 'var(--theme-money-gain)' };

    return (
        <SlideUpPanel title={text('UPDATE_EXPENSE_FOR_MONTH', [currentMonthName])}
                      closeText={text('CANCEL')}
                      confirmText={text('SUBMIT')}
                      forwardActionCallback={submit}
                      tagColor='var(--theme-red-dark)'
                      disableConfirmButton={spendAmount == null}
                      onPanelClose={onPanelClose}
        >
            <form className={styles.expenseUpdateForm}>
                <div className={styles.expenseSummary}>
                    <CategoryIcon categoryCode={expenseToUpdate.category}
                                  containerSize='56px'
                                  iconSize='33px'
                                  customClasses={styles.iconContainer}
                    />
                    <div>
                        <div className={styles.expenseNameLabel}>
                            {expenseToUpdate.expenseName}
                        </div>
                        <div className={styles.expenseAmountLabel}>
                            {text('ESTIMATED_AMOUNT', [formatCurrency(estimatedMonthlyAmount)])}
                        </div>
                    </div>
                </div>
                <label>
                    <div className={styles.updateLabel}>
                        {text('AMOUNT_SPENT_IN_MONTH', [currentMonthName])}
                    </div>
                    <MoneyInput name='account-value-spent-field'
                                placeholder={formatCurrency(estimatedMonthlyAmount)}
                                className={styles.textInput}
                                stateUpdater={setSpendAmount}
                                value={spendAmount}
                    />
                </label>
                <label>
                    {text('AMOUNT_SPENT_COMPARED')}
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