import styles from './CategoryIcon.module.css';
import { clsx } from 'clsx';
import accountCategoryIconMapper from './accountCategoryIconMapper';
import { AccountCategory } from 'Types/accountTypes';

type AccountCategoryIconPropTypes = {
    categoryCode: AccountCategory;
    size: number;
    roundedCorners?: boolean;
    className?: string;
};

export default function AccountCategoryIcon({
    categoryCode,
    size = 32,
    roundedCorners = true,
    className,
}: AccountCategoryIconPropTypes) {
    const containerStyle = {
        height: size,
        width: size,
        backgroundColor: `var(--theme-color-account-category-${categoryCode})`,
        fontSize: size * 0.75,
        // radius 1/8th the size
        borderRadius: roundedCorners ? size * (1 / 8) : 0,
    };

    return (
        <div className={clsx(styles.icon, className)} style={containerStyle}>
            {accountCategoryIconMapper[categoryCode]}
        </div>
    );
}
