import { useState } from 'react';
import styles from './EditableTransactionListItem.module.css';
import MoneyInput from 'Components/UIElements/Form/MoneyInput/MoneyInput';
import { FaPencilAlt, FaPlusCircle } from 'react-icons/fa';
import dayjs from 'dayjs';
import SkeletonLoader from 'Components/UIElements/Loading/SkeletonLoader/SkeletonLoader';

type EditableTransactionListItemPropTypes = {
    date: string, // TODO: Restrict string to certain date type?
    amount: number,
    amountLabel: string,
    placeholderLabel: string,
    confirmButtonLabel: string,
    onConfirm: (amountToLog: number, transactionId: string, date: string, isNewTransaction: boolean) => void,
    transactionId?: string,
    showAsLoader?: boolean,
    isNewTransaction?: boolean,
    newTransactionLabel?: string
};
export default function EditableTransactionListItem({ date,
    amount,
    amountLabel,
    placeholderLabel = '',
    confirmButtonLabel,
    onConfirm,
    transactionId = '',
    showAsLoader = false,
    isNewTransaction = false,
    newTransactionLabel }: EditableTransactionListItemPropTypes) {
    const startingAmount = Number(amount?.toFixed(2)) ?? null;
    const [expenseAmount, setExpenseAmount] = useState<string | undefined>(isNewTransaction ? void 0 : `${startingAmount}`);
    const [initialExpenseAmount, setInitialExpenseAmount] = useState<number | undefined>(startingAmount ?? -1);
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
        setInitialExpenseAmount(isNewTransaction ? void 0 : Number(expenseAmount));
        onConfirm(Number(amountToLog!), transactionId, date, isNewTransaction);
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
                !showAsLoader && (Number(expenseAmount) !== initialExpenseAmount) && (
                    <button className={styles.confirmButton} onClick={handleConfirmation}>
                        {confirmButtonLabel}
                    </button>
                )
            }
        </div>
    );
}