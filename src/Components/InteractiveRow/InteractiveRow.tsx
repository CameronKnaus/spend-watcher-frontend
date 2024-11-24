import clsx from 'clsx';
import { ComponentProps, ReactNode } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import styles from './InteractiveRow.module.css';

type InteractiveRowPropTypes = {
    icon?: ReactNode;
    primaryLabel: ReactNode;
    secondaryLabel?: ReactNode;
    primaryDataPoint: ReactNode;
    secondaryDataPoint?: ReactNode;
} & ComponentProps<'button'>;

export default function InteractiveRow({
    icon,
    primaryLabel,
    secondaryLabel,
    primaryDataPoint,
    secondaryDataPoint,
    className,
    onClick,
    ...attributes
}: InteractiveRowPropTypes) {
    return (
        <button onClick={onClick} className={clsx(styles.interactiveRow, className)} {...attributes}>
            {icon}
            <div className={styles.detailsContainer}>
                <div className={styles.primaryRow}>
                    <span>{primaryLabel}</span>
                    <span>{primaryDataPoint}</span>
                </div>
                <div className={styles.dataRow}>
                    {secondaryLabel && <div className={styles.secondaryRow}>{secondaryLabel}</div>}
                    {secondaryDataPoint && <div className={styles.secondaryRow}>{secondaryDataPoint}</div>}
                </div>
            </div>
            <FaChevronRight className={styles.chevron} />
        </button>
    );
}
