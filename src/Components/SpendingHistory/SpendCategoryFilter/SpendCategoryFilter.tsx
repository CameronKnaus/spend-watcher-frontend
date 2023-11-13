import styles from './SpendCategoryFilter.module.css';
import { SpendingCategoryInputs } from 'Components/UIElements/Form/CategoryInput/CategoryInput';
import useContent from 'CustomHooks/useContent';
import Link from 'Components/UIElements/Navigation/Link/Link';
import clsx from 'clsx';
import { SpendingCategoryType } from 'Constants/categories';
import { Dispatch, SetStateAction } from 'react';

type SpendCategoryFilterPropTypes = {
    filterCategory: SpendingCategoryType | '',
    setFilterCategory: Dispatch<SetStateAction<SpendingCategoryType | ''>>,
    textInputStyles: string;
};

export default function SpendCategoryFilter({ filterCategory, setFilterCategory, textInputStyles }: SpendCategoryFilterPropTypes) {
    const getContent = useContent('SPENDING_BREAKDOWN');

    return (
        <>
            <div className={styles.filterLabel}>
                <label htmlFor='category-input'>
                    { getContent('FILTER_BY_CATEGORY') }
                </label>
            </div>
            <SpendingCategoryInputs value={filterCategory}
                                    textInputStyles={textInputStyles}
                                    onChange={setFilterCategory}
            />
            {
                filterCategory && (
                    <Link text={getContent('REMOVE_FILTER')}
                          customClass={clsx(styles.clearFilterLink)}
                          onClickCallback={() => setFilterCategory('')}
                    />
                )
            }
        </>
    );
}