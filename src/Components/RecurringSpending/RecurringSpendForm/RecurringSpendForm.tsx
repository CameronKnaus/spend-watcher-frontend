import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './RecurringSpendForm.module.css';
import MoneyInput from 'Components/UIElements/Form/MoneyInput/MoneyInput';
import { SpendingCategoryInputs } from 'Components/UIElements/Form/CategoryInput/CategoryInput';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import axios from 'axios';
import Link from 'Components/UIElements/Navigation/Link/Link';
import { IoTrashSharp } from 'react-icons/io5';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyCallback } from 'Types/QoLTypes';
import { RecurringTransaction } from 'Types/TransactionTypes';
import { SpendingCategoryType } from 'Constants/categories';
import { recurringTransactionDependentQueryKeys } from 'Util/QueryKeys';

type RecurringSpendFormPropTypes = {
    editMode: boolean,
    existingTransaction?: RecurringTransaction,
    formIsValidCallback: Dispatch<SetStateAction<boolean>>,
    setDeleteSpeedBumpActive: EmptyCallback,
    setForwardActionCallback: Dispatch<SetStateAction<EmptyCallback>>,
    viewHistoryTab: EmptyCallback,
};

const defaultExistingTransaction: RecurringTransaction = {
    actualAmount: 0,
    category: SpendingCategoryType.OTHER,
    estimatedAmount: 0,
    expenseName: '',
    isActive: false,
    isVariableRecurring: false,
    recurringSpendId: '',
    requiresUpdate: false
};

// existingTransaction should be an object containing all transaction keys
export default function RecurringSpendForm({ editMode,
    existingTransaction = defaultExistingTransaction,
    formIsValidCallback,
    setDeleteSpeedBumpActive,
    setForwardActionCallback,
    viewHistoryTab }: RecurringSpendFormPropTypes) {
    const getContent = useContent('RECURRING_SPENDING');
    const queryClient = useQueryClient();

    // State for form values
    const [expenseName, setExpenseName] = useState(existingTransaction.expenseName ?? '');
    const [isVariable, setIsVariable] = useState(Boolean(existingTransaction.isVariableRecurring ?? 0));
    const [amount, setAmount] = useState(existingTransaction.estimatedAmount || null);
    const [category, setCategory] = useState(existingTransaction.category || SpendingCategoryType.OTHER);

    useEffect(() => {
        setForwardActionCallback(() => {
            function onSubmission() {
                queryClient.invalidateQueries(recurringTransactionDependentQueryKeys);
            }

            if(editMode) {
                return () => {
                    // Handle service call
                    axios.post(SERVICE_ROUTES.editRecurringExpense, {
                        recurringSpendId: existingTransaction.recurringSpendId,
                        spendName: expenseName,
                        amount: amount,
                        spendCategory: category || 'OTHER',
                        isVariable
                    }).then(onSubmission);
                };
            }

            return () => {
                // Handle service call
                axios.post(SERVICE_ROUTES.submitNewRecurringExpense, {
                    spendName: expenseName,
                    amount: amount,
                    spendCategory: category || 'OTHER',
                    isVariable
                }).then(onSubmission);
            };
        });
    }, [amount, category, editMode, existingTransaction.recurringSpendId, expenseName, isVariable, queryClient, setForwardActionCallback]);

    // Update form validity only based on amount having a positive value
    useEffect(() => {
        formIsValidCallback((amount || 0) > 0 && expenseName.length > 0);
    }, [amount, expenseName, formIsValidCallback]);

    const variableExpenseLabel = getContent('VARIABLE_EXPENSE_LABEL');
    const variableExpenseDescription = getContent('VARIABLE_EXPENSE_DESCRIPTION');
    const amountLabel = getContent(isVariable ? 'ESTIMATED_MONTHLY_AMOUNT' : 'MONTHLY_AMMOUNT');

    return (
        // This marginBottom offset keeps the permanently delete option out of the initial view (requiring scroll)
        <div style={{ marginBottom: editMode ? '-5rem' : '' }}>
            <form className={styles.RecurringSpendForm}>
                <label>
                    {getContent('EXPENSE_NAME_LABEL')}
                    <input type='text'
                           className={styles.textInput}
                           placeholder={getContent('EXPENSE_NAME_PLACEHOLDER')}
                           value={expenseName}
                           autoComplete='off'
                           maxLength={60}
                           onChange={(event) => setExpenseName(event.target.value)}
                    />
                </label>
                <label htmlFor='category-input' style={{ width: 100 }}>
                    {getContent('CATEGORY_LABEL')}
                </label>
                <SpendingCategoryInputs textInputStyles={styles.textInput}
                                        value={category}
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
                                placeholder={getContent('AMOUNT_PLACEHOLDER')}
                                className={styles.textInput}
                                stateUpdater={setAmount}
                                value={amount}
                    />
                </label>
            </form>
            {
                editMode && (
                <Link useChevron
                      text={getContent('VIEW_HISTORY')}
                      customClass={styles.historyLink}
                      onClickCallback={viewHistoryTab}
                />
                )
            }
            {
                editMode && (
                <Link text={getContent('PERMANENTLY_DELETE')}
                      CustomIcon={IoTrashSharp}
                      customClass={styles.deleteLink}
                      onClickCallback={() => {
                            setDeleteSpeedBumpActive();
                      }}
                />
                )
            }
        </div>
    );
}