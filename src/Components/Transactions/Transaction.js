import React from 'react';
import styles from '../../Styles/Components/Transactions/Transaction.module.css';
import useContent from '../../CustomHooks/useContent';
import { CgChevronRight } from 'react-icons/cg';
import CategoryIcon from '../UIElements/CategoryIcon';

// category - string constant for the category of transaction (i.e. 'RESTAURANTS' or 'MATERIAL_ITEMS'
// description - optional string - an additional note about the transaction
// amount - Number - Dollar amount of the transaction (will show in red with a minus)
// date - String - String using the ISO Date format
export default function Transaction({ category, description, amount, date }) {
    const getContent = useContent();
    const categoryText = key => getContent('CATEGORIES', key);

    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

    return (
        <button className={styles.container}>
            <CategoryIcon categoryCode={category}
                          containerSize='40px'
                          iconSize='20px'
                          customClasses={styles.iconContainer}
            />
            <div className={styles.detailsContainer}>
                <div className={styles.category}>
                    {categoryText(category)}
                </div>
                {
                    description && (
                        <div className={styles.description}>
                            {description}
                        </div>
                    )
                }
            </div>
            <div className={styles.valuesContainer}>
                <div className={styles.amount}>
                    {'-$' + amount.toFixed(2)}
                </div>
                <div className={styles.date}>
                    {formattedDate}
                </div>
            </div>
            <CgChevronRight className={styles.chevron} />
        </button>
    );
}