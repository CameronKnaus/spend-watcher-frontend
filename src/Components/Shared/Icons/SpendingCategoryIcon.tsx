import styles from './CategoryIcon.module.css';
import { clsx } from 'clsx';
import spendCategoryIconMapper from 'Components/Shared/Icons/spendCategoryIconMapper';
import { MdRefresh } from 'react-icons/md';
import { SpendingCategory } from 'Types/spendTransactionTypes';

type SpendingCategoryIconPropTypes = {
    categoryCode: SpendingCategory;
    size: number;
    className?: string;
    showRevolvingIcon?: boolean;
};

export default function SpendingCategoryIcon({
    categoryCode,
    size = 32,
    className,
    showRevolvingIcon = false,
}: SpendingCategoryIconPropTypes) {
    const containerStyle = {
        height: size,
        width: size,
        backgroundColor: `var(--theme-color-spend-category-${categoryCode})`,
        fontSize: size * 0.7, // Size of the icon inside is based on font-size
    };

    return (
        <div className={clsx(styles.icon, className)} style={containerStyle}>
            {showRevolvingIcon ? (
                <>
                    {spendCategoryIconMapper[categoryCode]}
                    <div
                        className={styles.revolvingIcon}
                        style={{ animationDelay: `${(Math.random() * 8).toFixed(2)}s` }}
                    >
                        <MdRefresh />
                    </div>
                </>
            ) : (
                spendCategoryIconMapper[categoryCode]
            )}
        </div>
    );
}
