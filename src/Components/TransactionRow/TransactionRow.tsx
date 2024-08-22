import { SpendingCategory } from 'Types/spendTransactionTypes';
import styles from './TransactionRow.module.css';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import { ComponentProps } from 'react';
import { clsx } from 'clsx';
import useContent from 'Hooks/useContent';
import Currency from 'Components/Currency/Currency';
import { FaChevronRight } from 'react-icons/fa';
import { TransactionId } from 'Types/Services/spending.model';

type TransactionRowPropTypes<T extends TransactionId> = {
    transactionId: T;
    category: SpendingCategory;
    amountSpent: number;
    note?: string;
    className?: string;
    onClick: (transactionId: T) => void;
};

export default function TransactionRow<T extends TransactionId>({
    transactionId,
    category,
    amountSpent,
    note,
    className,
    onClick,
    ...attributes
}: TransactionRowPropTypes<T> & Omit<ComponentProps<'button'>, 'onClick' | 'className'>) {
    const getCategoryLabel = useContent('SPENDING_CATEGORIES');

    return (
        <button
            onClick={() => onClick(transactionId)}
            className={clsx(styles.transactionsRow, className)}
            {...attributes}
        >
            <SpendingCategoryIcon category={category} size={40} />
            <div className={styles.transactionDetails}>
                <div className={styles.dataRow}>
                    <span>{getCategoryLabel(category)}</span>
                    <span>
                        <Currency amount={-amountSpent} isGainLoss />
                    </span>
                </div>
                {note && <div className={styles.noteRow}>{note}</div>}
            </div>
            <FaChevronRight className={styles.chevron} />
        </button>
    );
}
