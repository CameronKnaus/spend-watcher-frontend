import clsx from 'clsx';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import { ComponentProps } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import styles from './TransactionRow.module.css';

export default function LoadingTransactionRow({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div className={clsx(styles.transactionsRow, className)} {...props}>
            <div className={styles.transactionDetails}>
                <div className={styles.dataRow}>
                    <SkeletonLoader style={{ height: 20, width: 110 }} />
                    <SkeletonLoader style={{ height: 20, width: 50 }} />
                </div>
                <SkeletonLoader style={{ height: 18, width: 60, marginTop: 4 }} />
            </div>
            <FaChevronRight className={styles.chevron} />
        </div>
    );
}
