import { useState, useEffect } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from 'Styles/Components/RecurringSpending/RecurringSpendForm.module.css';
import MoneyInput from 'Components/UIElements/Form/MoneyInput';
import CategoryInput from 'Components/UIElements/Form/CategoryInput';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import axios from 'axios';
import Link from 'Components/UIElements/Navigation/Link';
import { IoTrashSharp } from 'react-icons/io5';

// existingTransaction should be an object containing all transaction keys
export default function RecurringSpendForm({ onSubmission, editMode, existingTransaction = {}, formIsValidCallback, setDeleteSpeedBumpActive, setForwardActionCallback, viewHistoryTab }) {
    const text = useContent('RECURRING_SPENDING');
    const getContent = useContent();

    // State for form values
    const [expenseName, setExpenseName] = useState(existingTransaction.expenseName ?? '');
    const [isVariable, setIsVariable] = useState(Boolean(existingTransaction.isVariableRecurring ?? 0));
    const [amount, setAmount] = useState(existingTransaction.estimatedAmount || null);
    const [category, setCategory] = useState(existingTransaction.category || { code: 'OTHER', name: getContent('SPENDING_CATEGORIES', 'OTHER') });

    useEffect(() => {
        if(editMode) {
            const editCallback = () => {
                // Handle service call
                axios.post(SERVICE_ROUTES.editRecurringExpense, {
                    recurringSpendId: existingTransaction.recurringSpendId,
                    spendName: expenseName,
                    amount: parseFloat(amount),
                    spendCategory: (category && category.code) || 'OTHER',
                    isVariable
                }).then(onSubmission);
            };

            setForwardActionCallback(() => {
                return editCallback;
            });

            return;
        }

        const newSubmissionCallback = () => {
            // Handle service call
            axios.post(SERVICE_ROUTES.submitNewRecurringExpense, {
                spendName: expenseName,
                amount: parseFloat(amount),
                spendCategory: (category && category.code) || 'OTHER',
                isVariable
            }).then(onSubmission);
        };

        setForwardActionCallback(() => {
            return newSubmissionCallback;
        });
    }, [amount, category, editMode, existingTransaction.recurringSpendId, expenseName, isVariable, onSubmission, setForwardActionCallback]);

    // Update form validity only based on amount having a positive value
    useEffect(() => {
        formIsValidCallback(amount > 0 && expenseName.length > 0);
    }, [amount, expenseName, formIsValidCallback]);

    const variableExpenseLabel = text('VARIABLE_EXPENSE_LABEL');
    const variableExpenseDescription = text('VARIABLE_EXPENSE_DESCRIPTION');
    const amountLabel = text(isVariable ? 'ESTIMATED_MONTHLY_AMOUNT' : 'MONTHLY_AMMOUNT');

    return (
        // This marginBottom offset keeps the permanently delete option out of the initial view (requiring scroll)
        <div style={{ marginBottom: editMode ? '-5rem' : '' }}>
            <form className={styles.RecurringSpendForm}>
                <label>
                    {text('EXPENSE_NAME_LABEL')}
                    <input type='text'
                           className={styles.textInput}
                           placeholder={text('EXPENSE_NAME_PLACEHOLDER')}
                           value={expenseName}
                           autoComplete='off'
                           maxLength={60}
                           onChange={(event) => setExpenseName(event.target.value)}
                    />
                </label>
                <label htmlFor='category-input' style={{ width: 100 }}>
                    {text('CATEGORY_LABEL')}
                </label>
                <CategoryInput textInputStyles={styles.textInput}
                               value={category}
                               categoryType='transactions'
                               onChange={setCategory}
                />
                <div className={styles.checkContainer}>
                    <input type='checkbox'
                           aria-label={`${variableExpenseLabel},${variableExpenseDescription}`}
                           className={styles.checkBox}
                           checked={isVariable}
                           onChange={() => setIsVariable(prev => !prev)}
                    />
                    <div aria-hidden className={styles.checkLabel}>
                        {variableExpenseLabel}
                    </div>
                    <div aria-hidden className={styles.checkDescription}>
                        {variableExpenseDescription}
                    </div>
                </div>
                <label>
                    {amountLabel}
                    <MoneyInput name='amount-spent-field'
                                placeholder={text('AMOUNT_PLACEHOLDER')}
                                className={styles.textInput}
                                stateUpdater={setAmount}
                                value={amount}
                    />
                </label>
            </form>
            {
                editMode && (
                <Link useChevron
                      text={text('VIEW_HISTORY')}
                      customClass={styles.historyLink}
                      onClickCallback={viewHistoryTab}
                />
                )
            }
            {
                editMode && (
                <Link text={text('PERMANENTLY_DELETE')}
                      CustomIcon={IoTrashSharp}
                      customClass={styles.deleteLink}
                      onClickCallback={() => {
                            setDeleteSpeedBumpActive(true);
                      }}
                />
                )
            }
        </div>
    );
}