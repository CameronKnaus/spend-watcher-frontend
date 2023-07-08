import { useState } from 'react';
import styles from './EditableTransactionListItem.module.css';
import MoneyInput from 'Components/UIElements/Form/MoneyInput/MoneyInput';
import { FaPencilAlt, FaPlusCircle } from 'react-icons/fa';
import dayjs from 'dayjs';
import SkeletonLoader from 'Components/UIElements/Loading/SkeletonLoader/SkeletonLoader';

export default function EditableTransactionListItem({ date, amount, amountLabel, placeholderLabel, confirmButtonLabel, onConfirm, transactionId, showAsLoader, isNewTransaction = false, newTransactionLabel }) {
    const startingAmount = amount?.toFixed(2) ?? null;
    const [expenseAmount, setExpenseAmount] = useState(isNewTransaction ? null : startingAmount);
    const [initialExpenseAmount, setInitialExpenseAmount] = useState(startingAmount ?? -1);
    const [isNewTransactionMode, setIsNewTransactionMode] = useState(isNewTransaction);

    if(!showAsLoader && isNewTransactionMode) {
        return (
            <button className={styles.newTransactionButton} onClick={() => setIsNewTransactionMode(false)}>
                <span className={styles.additionIcon}>
                    <FaPlusCircle />
                </span>
                {newTransactionLabel}
            </button>
        );
    }

    function handleConfirmation() {
        const amountToLog = isNewTransaction && expenseAmount == null ? startingAmount : expenseAmount;

        // Reset initial expense amount to the new value.
        setIsNewTransactionMode(isNewTransaction);
        setInitialExpenseAmount(isNewTransaction ? null : expenseAmount);
        onConfirm(amountToLog, transactionId, date, isNewTransaction);
    }

    return (
        <div className={styles.transactionContainer}>
            <div className={`${styles.halfContainer} ${styles.dateContainer}`}>
                <SkeletonLoader isActive={showAsLoader} width='70%' align='left' height={34}>
                    {dayjs(date).format('MM/YYYY')}
                </SkeletonLoader>
            </div>
            <div className={`${styles.halfContainer}`}>
                <label className={styles.moneyInputLabel} htmlFor='account-value-spent-field'>
                    {amountLabel}
                </label>
                <SkeletonLoader isActive={showAsLoader}>
                    <div className={styles.moneyInputContainer}>
                        <div className={styles.editIcon}>
                            <FaPencilAlt />
                        </div>
                        <MoneyInput name='account-value-spent-field'
                                    placeholder={placeholderLabel}
                                    className={styles.moneyInput}
                                    stateUpdater={setExpenseAmount}
                                    value={expenseAmount}
                        />
                    </div>
                </SkeletonLoader>
            </div>
            {
                !showAsLoader && (expenseAmount !== initialExpenseAmount) && (
                    <button className={styles.confirmButton} onClick={handleConfirmation}>
                        {confirmButtonLabel}
                    </button>
                )
            }
        </div>
    );
}