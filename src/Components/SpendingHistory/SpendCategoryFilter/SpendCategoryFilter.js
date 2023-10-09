import styles from './SpendCategoryFilter.module.css';
import CategoryInput from 'Components/UIElements/Form/CategoryInput/CategoryInput';
import useContent from 'CustomHooks/useContent';
import Link from 'Components/UIElements/Navigation/Link/Link';
import clsx from 'clsx';


export default function SpendCategoryFilter({ filterCategory, setFilterCategory, textInputStyles }) {
    const getContent = useContent('SPENDING_BREAKDOWN');

    return (
        <>
            <div className={styles.filterLabel}>
                <label htmlFor='category-input'>
                    { getContent('FILTER_BY_CATEGORY') }
                </label>
            </div>
            <CategoryInput categoryContentType='SPENDING_CATEGORIES'
                           categoryType='transactions'
                           value={filterCategory}
                           textInputStyles={textInputStyles}
                           onChange={setFilterCategory}
            />
            {
                filterCategory.code && (
                    <Link text={getContent('REMOVE_FILTER')}
                          customClass={clsx(styles.clearFilterLink)}
                          onClickCallback={() => setFilterCategory({ name: '', code: '' })}
                    />
                )
            }
        </>
    );
}