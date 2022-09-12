import styles from 'Styles/Components/UIElements/InteractiveDataRow.module.css';
import { CgChevronRight } from 'react-icons/cg';
import CategoryIcon from './CategoryIcon';
import formatCurrency from '../../Util/formatCurrency';

// category - string constant for the category of account or transaction (i.e. 'RESTAURANTS' or 'CHECKING')
// description - optional string - an additional note about the transaction
// amount - Number - Dollar amount of the transaction
// isExpense - Boolean - When true will show amount in red with a minus
// date - String
// iconCategory - String - uses the Account or transaction category code to render the right icon, leave blank for no icon
export default function InteractiveDataRow({ title, description, amount, date, isExpense, iconCategory, onClick }) {
    // Amount to show
    const parsedAmount = (isExpense ? '-' : '') + formatCurrency(amount);

    return (
        <button className={styles.container} onClick={onClick}>
            {
                iconCategory && (
                    <CategoryIcon categoryCode={iconCategory}
                                  containerSize='40px'
                                  iconSize='20px'
                                  customClasses={styles.iconContainer}
                    />
                )
            }
            <div className={styles.detailsContainer}>
                <div className={styles.category}>
                    {title}
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
                <div className={`${styles.amount} ${isExpense ? styles.expense : ''}`}>
                    {parsedAmount}
                </div>
                <div className={styles.date}>
                    {date}
                </div>
            </div>
            <CgChevronRight className={styles.chevron} />
        </button>
    );
}