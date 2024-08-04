import useContent from 'CustomHooks/useContent';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';
import ThickActionButton from 'Components/UIElements/Form/ThickActionButton/ThickActionButton';
import { useState } from 'react';
import styles from './RecurringExpensesList.module.css';
import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import RecurringSpendSlideInPanel from '../RecurringSpendSlideInPanel/RecurringSpendSlideInPanel';
import formatCurrency from '../../../Util/Formatters/formatCurrency';
import { FaPencilAlt } from 'react-icons/fa';
import MonthlySpendUpdateForm from 'Components/RecurringSpending/MonthlySpendUpdateForm/MonthlySpendUpdateForm';
import Alert from 'Components/UIElements/Informational/Alert/Alert';
import { RecurringTransaction } from 'Types/TransactionTypes';
import englishContent from 'Content/englishContent.json';

type RecurringExpensesListPropTypes = {
    isLoading?: boolean,
    transactionList: Array<RecurringTransaction>,
    hasNoExpenses?: boolean,
    quickUpdateMode?: boolean
}

export default function RecurringExpensesList({ isLoading = false, transactionList, hasNoExpenses = false, quickUpdateMode = false }: RecurringExpensesListPropTypes) {
    const [createExpensePanelOpen, setCreateExpensePanelOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<RecurringTransaction | null>(null);
    const [expenseToUpdate, setExpenseToUpdate] = useState<RecurringTransaction | null>(null);
    const getContent = useContent('RECURRING_SPENDING');
    const getCategoryContent = useContent('SPENDING_CATEGORIES');

    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

    const headerClass = quickUpdateMode ? styles.quickUpdateHeader : `small-header-text ${styles.categoryLabel}`;
    let headerContentKey: keyof typeof englishContent.RECURRING_SPENDING;
    if(quickUpdateMode) {
        headerContentKey = 'MONTHLY_UPDATE_REQUIRED';
    } else if(hasNoExpenses) {
        headerContentKey = 'NO_TRANSACTIONS_HEADER';
    } else {
        headerContentKey = 'RECURRING_TRANSACTIONS';
    }

    function handleListItemSelection(transaction: RecurringTransaction) {
        if(quickUpdateMode) {
            setExpenseToUpdate(transaction);
            return;
        }

        setExpenseToEdit(transaction);
    }

    return (
        <>
            <h3 className={headerClass}>
                {getContent(headerContentKey)}
            </h3>
            {
                hasNoExpenses && (
                    <div className={styles.noTransactionsDescription}>
                        {getContent('NONE_LOGGED_YET')}
                    </div>
                )
            }
            {
                quickUpdateMode && (
                    <div className={styles.alertContainer}>
                        <Alert alertText={getContent('ATTENTION_UPDATE_REQUIRED')} size='small' />
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

                            let description = getCategoryContent(category);
                            let amountDescription;
                            let amount;

                            if(isVariable) {
                                amount = requiresUpdate ? '--' : actualAmount;
                                description += ` ${getContent('VARIABLE')}`;
                                amountDescription = getContent('VARIABLE_EXPENSE', [formatCurrency(estimatedAmount)]);
                            } else {
                                amount = actualAmount;
                                const estimateDiffersFromActual = estimatedAmount !== actualAmount;
                                amountDescription = estimateDiffersFromActual ? getContent('VARIABLE_EXPENSE', [formatCurrency(estimatedAmount)]) : getContent('FIXED_EXPENSE');
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
                                            {getContent('UPDATE_REQUIRED', [currentMonthName])}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                }
            </div>
            {
                !quickUpdateMode && <ThickActionButton buttonColor='var(--theme-red-dark)'
                                                       text={getContent('CREATE_NEW')}
                                                       callback={() => { setCreateExpensePanelOpen(true) }}
                                                       isDisabled={isLoading}
                                    />
            }
            {
                createExpensePanelOpen && <RecurringSpendSlideInPanel onPanelClose={() => setCreateExpensePanelOpen(false)} />
            }
            {
                expenseToEdit && (
                    <RecurringSpendSlideInPanel editMode
                                                existingTransaction={expenseToEdit}
                                                onPanelClose={() => setExpenseToEdit(null)}
                    />
                )
            }
            {
                expenseToUpdate && (
                    <MonthlySpendUpdateForm expenseToUpdate={expenseToUpdate}
                                            currentMonthName={currentMonthName}
                                            onPanelClose={() => setExpenseToUpdate(null)}
                    />
                )
            }
        </>
    );
}