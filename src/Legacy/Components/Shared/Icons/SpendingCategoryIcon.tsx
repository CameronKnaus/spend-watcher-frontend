import styles from './CategoryIcon.module.css';
import { clsx } from 'clsx';
import { SpendCategoryIconMapper, SpendingCategory } from 'Constants/SpendCategories';
import { MdRefresh } from 'react-icons/md';

type SpendingCategoryIconPropTypes = {
    categoryCode: SpendingCategory;
    size: number;
    roundedCorners?: boolean;
    className?: string;
    showRevolvingIcon?: boolean;
};

export default function SpendingCategoryIcon({
    categoryCode,
    size = 32,
    roundedCorners = true,
    className,
    showRevolvingIcon = false,
}: SpendingCategoryIconPropTypes) {
    const containerStyle = {
        height: size,
        width: size,
        backgroundColor: `var(--theme-color-spend-category-${categoryCode})`,
        fontSize: size * 0.75,
        // radius 1/8th the size
        borderRadius: roundedCorners ? size * (1 / 8) : 0,
    };

    return (
        <div className={clsx(styles.icon, className)} style={containerStyle}>
            {showRevolvingIcon ? (
                <>
                    {SpendCategoryIconMapper[categoryCode]}
                    <div
                        className={styles.revolvingIcon}
                        style={{ animationDelay: `${(Math.random() * 8).toFixed(2)}s` }}
                    >
                        <MdRefresh />
                    </div>
                </>
            ) : (
                SpendCategoryIconMapper[categoryCode]
            )}
        </div>
    );
}
