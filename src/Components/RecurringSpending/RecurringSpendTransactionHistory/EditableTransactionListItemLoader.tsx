import SkeletonLoader from 'Components/UIElements/Loading/SkeletonLoader/SkeletonLoader';
import styles from './EditableTransactionListItem.module.css';

type EditableTransactionListItemLoaderPropTypes = {
    label: string;
}
export default function EditableTransactionListItemLoader({ label }: EditableTransactionListItemLoaderPropTypes) {

    return (
        <div className={styles.transactionContainer}>
            <div className={`${styles.halfContainer} ${styles.dateContainer}`}>
                <SkeletonLoader isActive width='70%' align='left' height={34} />
            </div>
            <div className={`${styles.halfContainer}`}>
                <label className={styles.moneyInputLabel} htmlFor='account-value-spent-field'>
                    {label}
                </label>
                <SkeletonLoader isActive />
            </div>
        </div>
    );
}