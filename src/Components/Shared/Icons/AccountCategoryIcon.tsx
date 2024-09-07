import { clsx } from 'clsx';
import { AccountCategory } from 'Types/accountTypes';
import accountCategoryIconMapper from './accountCategoryIconMapper';
import styles from './CategoryIcon.module.css';

type AccountCategoryIconPropTypes = {
    category: AccountCategory;
    size: number;
    roundedCorners?: boolean;
    className?: string;
};

export default function AccountCategoryIcon({
    category,
    size = 32,
    roundedCorners = true,
    className,
}: AccountCategoryIconPropTypes) {
    const containerStyle = {
        height: size,
        width: size,
        backgroundColor: `var(--theme-color-account-category-${category})`,
        fontSize: size * 0.75,
        // radius 1/8th the size
        borderRadius: roundedCorners ? size * (1 / 8) : 0,
    };

    return (
        <div className={clsx(styles.icon, className)} style={containerStyle}>
            {accountCategoryIconMapper[category]}
        </div>
    );
}
