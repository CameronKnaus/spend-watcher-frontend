import { clsx } from 'clsx';
import Currency from 'Components/Currency/Currency';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import useContent from 'Hooks/useContent';
import { ComponentProps } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { DiscretionaryTransactionId } from 'Types/Services/spending.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import styles from './TransactionRow.module.css';

type TransactionRowPropTypes = {
    transactionId: DiscretionaryTransactionId;
    category: SpendingCategory;
    amountSpent: number;
    note?: string;
    className?: string;
    onClick: (transactionId: DiscretionaryTransactionId) => void;
};

export default function TransactionRow({
    transactionId,
    category,
    amountSpent,
    note,
    className,
    onClick,
    ...attributes
}: TransactionRowPropTypes & Omit<ComponentProps<'button'>, 'onClick' | 'className'>) {
    const getCategoryLabel = useContent('SPENDING_CATEGORIES');

    return (
        <button
            onClick={() => onClick(transactionId)}
            className={clsx(styles.transactionsRow, className)}
            {...attributes}
        >
            <SpendingCategoryIcon category={category} size={36} />
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
