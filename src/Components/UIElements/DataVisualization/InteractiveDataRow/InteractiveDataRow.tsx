import styles from './InteractiveDataRow.module.css';
import { CgChevronRight } from 'react-icons/cg';
import CategoryIcon from 'Components/UIElements/VisualOnlyElements/CategoryIcon/CategoryIcon';
import formatCurrency from 'Util/Formatters/formatCurrency';
import SkeletonLoader from 'Components/UIElements/Loading/SkeletonLoader/SkeletonLoader';
import { EmptyCallback } from 'Types/QoLTypes';
import { AccountCategoryType, SpendingCategoryType } from 'Constants/categories';

function parseAmount(amount: number, isExpense: boolean) {
    const formattedAmount = formatCurrency(amount);

    if(amount === 0 || !isExpense) {
        return formattedAmount;
    }

    return `-${formattedAmount}`;
}

interface InteractiveDataRowPropTypes {
    title: string,
    description?: string,
    amount: number,
    amountDescription: string,
    isExpense: boolean,
    iconCategory: AccountCategoryType | SpendingCategoryType,
    onClick: EmptyCallback,
    isLoading: boolean,
    showRevolvingIcon: boolean
}

export default function InteractiveDataRow({ title, description, amount, amountDescription, isExpense, iconCategory, onClick, isLoading, showRevolvingIcon }: InteractiveDataRowPropTypes) {
    // Amount to show
    const parsedAmount = parseAmount(amount, isExpense);

    function handleClick() {
        if(isLoading) {
            return;
        }

        onClick();
    }

    return (
        <button className={styles.container} onClick={handleClick}>
            <SkeletonLoader isActive={isLoading} height={40} width={40} customStyling={{ marginRight: 12, borderRadius: 12, flexShrink: 0 }}>
                <CategoryIcon categoryCode={iconCategory}
                              containerSize='40px'
                              iconSize='20px'
                              customClasses={styles.iconContainer}
                              showRevolvingIcon={showRevolvingIcon}
                />
            </SkeletonLoader>
            <div className={styles.detailsContainer}>
                <div className={styles.category}>
                    <SkeletonLoader isActive={isLoading} height={20} width='80%'>
                        {title}
                    </SkeletonLoader>
                </div>
                {
                    (description || (!description && isLoading)) && (
                        <div className={styles.description}>
                            <SkeletonLoader isActive={isLoading} height={15} width='60%'>
                                {description}
                            </SkeletonLoader>
                        </div>
                    )
                }
            </div>
            <div className={styles.valuesContainer}>
                <div className={`${styles.amount} ${!isExpense || amount === 0 ? '' : styles.expense}`}>
                    <SkeletonLoader isActive={isLoading} height={20} width='65%' align='right'>
                        {typeof amount === 'string' ? amount : parsedAmount}
                    </SkeletonLoader>
                </div>
                <div className={styles.amountDescription}>
                    <SkeletonLoader isActive={isLoading} height={14} width='50%' align='right'>
                        {amountDescription}
                    </SkeletonLoader>
                </div>
            </div>
            <CgChevronRight className={styles.chevron} />
        </button>
    );
}