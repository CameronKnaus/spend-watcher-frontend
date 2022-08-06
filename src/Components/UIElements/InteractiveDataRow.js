import styles from 'Styles/Components/Transactions/Transaction.module.css';
import { CgChevronRight } from 'react-icons/cg';
import CategoryIcon from './CategoryIcon';

// category - string constant for the category of account or transaction (i.e. 'RESTAURANTS' or 'CHECKING')
// description - optional string - an additional note about the transaction
// amount - Number - Dollar amount of the transaction
// isExpense - Boolean - When true will show amount in red with a minus
// date - String - String using the ISO Date format
// iconCategory - String - uses the Account or transaction category code to render the right icon, leave blank for no icon
export default function InteractiveDataRow({ title, description, amount, date, isExpense, iconCategory, onClick }) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

    // Amount to show
    const parsedAmount = (isExpense ? '-$' : '$') + amount.toFixed(2);

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
                    {formattedDate}
                </div>
            </div>
            <CgChevronRight className={styles.chevron} />
        </button>
    );
}