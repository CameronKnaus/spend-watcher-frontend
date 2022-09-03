import styles from '../../Styles/Components/SpendingHistory/SpendCategoryFilter.module.css';
import CategoryInput from '../UIElements/Form/CategoryInput';
import useContent from '../../CustomHooks/useContent';
import Link from '../UIElements/Navigation/Link';


export default function SpendCategoryFilter({ filterCategory, setFilterCategory }) {
    const getContent = useContent('SPENDING_BREAKDOWN');

    return (
        <>
            <div className={styles.filterLabel}>
                <label htmlFor='category-input'>
                    { getContent('FILTER_BY_CATEGORY') }
                </label>
            </div>
            <CategoryInput categoryType='transactions'
                           value={filterCategory}
                           onChange={setFilterCategory}
            />
            {
                filterCategory.code && (
                    <Link text={getContent('REMOVE_FILTER')}
                          customClass={styles.clearFilterLink}
                          onClickCallback={() => setFilterCategory({ name: '', code: '' })}
                    />
                )
            }
        </>
    );
}