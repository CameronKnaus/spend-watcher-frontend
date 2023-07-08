import useContent from 'CustomHooks/useContent';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';
import ThickActionButton from 'Components/UIElements/Form/ThickActionButton/ThickActionButton';
import { useState } from 'react';
import styles from './RecurringExpensesList.module.css';
import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import RecurringSpendSlideInPanel from '../RecurringSpendSlideInPanel/RecurringSpendSlideInPanel';
import formatCurrency from '../../../Util/formatCurrency';
import { FaPencilAlt } from 'react-icons/fa';
import MonthlySpendUpdateForm from 'Components/RecurringSpending/MonthlySpendUpdateForm/MonthlySpendUpdateForm';
import Alert from 'Components/UIElements/Informational/Alert/Alert';

export default function RecurringExpensesList({ isLoading, transactionList, onSubmission, hasNoExpenses, quickUpdateMode }) {
    const [createExpensePanelOpen, setCreateExpensePanelOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [expenseToUpdate, setExpenseToUpdate] = useState(null);
    const getRecurringContent = useContent('RECURRING_SPENDING');
    const getContent = useContent();

    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

    function handleEditableExpensePanelClosure(serviceShouldRefresh) {
        setExpenseToEdit(null);

        if(serviceShouldRefresh) {
            onSubmission(true);
        }
    }

    const headerClass = quickUpdateMode ? styles.quickUpdateHeader : `small-header-text ${styles.categoryLabel}`;
    let headerContentKey;
    if(quickUpdateMode) {
        headerContentKey = 'MONTHLY_UPDATE_REQUIRED';
    } else if(hasNoExpenses) {
        headerContentKey = 'NO_TRANSACTIONS_HEADER';
    } else {
        headerContentKey = 'RECURRING_TRANSACTIONS';
    }

    function handleListItemSelection(transaction) {
        if(quickUpdateMode) {
            setExpenseToUpdate(transaction);
            return;
        }

        setExpenseToEdit({
            ...transaction,
            category: {
                code: transaction.category,
                name: getContent('SPENDING_CATEGORIES', transaction.category)
            }
        });
    }

    return (
        <>
            <h3 className={headerClass}>
                {getRecurringContent(headerContentKey)}
            </h3>
            {
                hasNoExpenses && (
                    <div className={styles.noTransactionsDescription}>
                        {getRecurringContent('NONE_LOGGED_YET')}
                    </div>
                )
            }
            {
                quickUpdateMode && (
                    <div className={styles.alertContainer}>
                        <Alert alertText={getRecurringContent('ATTENTION_UPDATE_REQUIRED')} size='small' />
                    </div>
                )
            }
            <div style={{ paddingBottom: quickUpdateMode ? 0 : '1.5rem' }}>
                {
                    isLoading ? (
                        <LoadingInteractiveRowList rowCount={5} rowSpacing={12} id='loading-fixed' />
                    ) :
                        transactionList?.map(transaction => {
                            const isVariable = transaction.isVariableRecurring;
                            const { category, actualAmount, estimatedAmount, requiresUpdate } = transaction;

                            let description = getContent('SPENDING_CATEGORIES', category);
                            let amountDescription;
                            let amount;

                            if(isVariable) {
                                amount = requiresUpdate ? '--' : actualAmount;
                                description += ` ${getRecurringContent('VARIABLE')}`;
                                amountDescription = getRecurringContent('VARIABLE_EXPENSE', [formatCurrency(estimatedAmount)]);
                            } else {
                                amount = actualAmount;
                                const estimateDiffersFromActual = estimatedAmount !== actualAmount;
                                amountDescription = estimateDiffersFromActual ? getRecurringContent('VARIABLE_EXPENSE', [formatCurrency(estimatedAmount)]) : getRecurringContent('FIXED_EXPENSE');
                            }

                            return (
                                <div key={transaction.recurringSpendId} className={styles.listItemWrapper}>
                                    <InteractiveDataRow isExpense
                                                        showRevolvingIcon
                                                        title={transaction.expenseName}
                                                        iconCategory={category}
                                                        description={description}
                                                        amount={amount ?? '--'}
                                                        amountDescription={amountDescription}
                                                        onClick={() => handleListItemSelection(transaction)}
                                    />
                                    {   !quickUpdateMode && transaction.requiresUpdate && (
                                        <button className={styles.updateButton} onClick={() => setExpenseToUpdate(transaction)}>
                                            <div className={styles.editIcon}>
                                                <FaPencilAlt />
                                            </div>
                                            {getContent('RECURRING_SPENDING', 'UPDATE_REQUIRED', [currentMonthName])}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                }
            </div>
            {
                !quickUpdateMode && <ThickActionButton buttonColor='var(--theme-red-dark)'
                                                       text={getRecurringContent('CREATE_NEW')}
                                                       callback={() => { setCreateExpensePanelOpen(true) }}
                                                       isDisabled={isLoading}
                                    />
            }
            {
                createExpensePanelOpen && <RecurringSpendSlideInPanel onPanelClose={() => setCreateExpensePanelOpen(false)} onSubmission={onSubmission} />
            }
            {
                expenseToEdit && (
                    <RecurringSpendSlideInPanel editMode
                                                existingTransaction={expenseToEdit}
                                                onPanelClose={handleEditableExpensePanelClosure}
                                                onSubmission={onSubmission}
                    />
                )
            }
            {
                expenseToUpdate && (
                    <MonthlySpendUpdateForm expenseToUpdate={expenseToUpdate}
                                            currentMonthName={currentMonthName}
                                            onPanelClose={() => setExpenseToUpdate(null)}
                                            onSubmission={onSubmission}
                    />
                )
            }
        </>
    );
}