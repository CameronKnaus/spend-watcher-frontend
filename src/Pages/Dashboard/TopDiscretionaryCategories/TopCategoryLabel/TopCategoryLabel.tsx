import Currency from 'Components/Currency/Currency';
import styles from './TopCategoryLabel.module.css';
import { SpendingCategory } from 'Types/spendTransactionTypes';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import { CSSProperties } from 'react';

type TopCategoryLabelPropTypes = {
    label: string;
    isVerticalList: boolean;
    category: SpendingCategory;
    amount: number;
    percentage: number;
    customIconStyles?: CSSProperties;
};

export default function TopCategoryLabel({
    label,
    isVerticalList,
    category,
    amount,
    percentage,
    customIconStyles,
}: TopCategoryLabelPropTypes) {
    const iconSize = 20;
    const containerStyle = {
        flexBasis: isVerticalList ? '100%' : 'calc(50% - (var(--category-list-item-gap)) / 2)',
    };

    return (
        <div className={styles.categoryListItem} style={containerStyle}>
            <SpendingCategoryIcon
                category={category}
                size={iconSize}
                className={styles.categoryIcon}
                style={customIconStyles}
            />
            <span>{label}</span>
            <div className={styles.amountContainer}>
                <Currency amount={amount} isGainLoss />
                <span className={styles.percentageValue}>{`(${percentage}%)`}</span>
            </div>
        </div>
    );
}
