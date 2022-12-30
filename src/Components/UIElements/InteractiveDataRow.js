import styles from 'Styles/Components/UIElements/InteractiveDataRow.module.css';
import { CgChevronRight } from 'react-icons/cg';
import CategoryIcon from './CategoryIcon';
import formatCurrency from '../../Util/formatCurrency';
import SkeletonLoader from './Loading/SkeletonLoader';

// category - string constant for the category of account or transaction (i.e. 'RESTAURANTS' or 'CHECKING')
// description - optional string - an additional note about the transaction
// amount - Number - Dollar amount of the transaction
// isExpense - Boolean - When true will show amount in red with a minus
// date - String
// iconCategory - String - uses the Account or transaction category code to render the right icon
// isLoading - boolean - when true shows skeleton loaders
export default function InteractiveDataRow({ title, description, amount, date, isExpense, isGain, iconCategory, onClick, isLoading }) {
    // Amount to show
    const parsedAmount = (isExpense ? '-' : '') + formatCurrency(amount);

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
                <div className={`${styles.amount} ${isExpense ? styles.expense : ''}`}>
                    <SkeletonLoader isActive={isLoading} height={20} width='65%' align='right'>
                        {parsedAmount}
                    </SkeletonLoader>
                </div>
                <div className={styles.date}>
                    <SkeletonLoader isActive={isLoading} height={14} width='50%' align='right'>
                        {date}
                    </SkeletonLoader>
                </div>
            </div>
            <CgChevronRight className={styles.chevron} />
        </button>
    );
}