import styles from '../Styles/Containers/SpendingHistory.module.css';
import TransactionsList from '../Components/UIElements/TransactionsList';
import SpendCategoryFilter from '../Components/SpendingHistory/SpendCategoryFilter';

export default function SpendingHistory({ transactionsList, filterCategory, setFilterCategory }) {
    return (
        <div className={styles.transactionsContainer}>
            <SpendCategoryFilter activeCategory={filterCategory}
                                 setFilterCategory={setFilterCategory}
                                 filterCategory={filterCategory}
            />
            <div className={styles.verticalSpacing}>
                <TransactionsList transactionsList={transactionsList}
                                  filteredCategory={filterCategory.code}
                />
            </div>
        </div>
    );
}