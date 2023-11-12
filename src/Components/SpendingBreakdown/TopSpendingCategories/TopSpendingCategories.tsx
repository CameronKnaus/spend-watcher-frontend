import { Dispatch, SetStateAction, useState } from 'react';
import styles from './TopSpendingCategories.module.css';
import { SPENDING_CATEGORIES, SpendingCategoryType } from 'Constants/categories';
import useContent from '../../../CustomHooks/useContent';
import Link from '../../UIElements/Navigation/Link/Link';
import clsx from 'clsx';
import { TAB_ENUM } from '../../../Pages/SpendingBreakdown/SpendingBreakdown';
import CategoryAmountChart from '../../UIElements/DataVisualization/CategoryAmountChart/CategoryAmountChart';

type TopSpendingCategoriesPropTypes = {
    label: string;
    categoryTotals?: Record<SpendingCategoryType, number>;
    setCurrentTab: Dispatch<SetStateAction<string>>;
    setFilterCategory: any;
    useDollarValues?: boolean;
}

export default function TopSpendingCategories({ label, categoryTotals, setCurrentTab, setFilterCategory, useDollarValues = false }: TopSpendingCategoriesPropTypes) {
    const [viewAll, setViewAll] = useState(false);
    const getSpendingCategoryContent = useContent('SPENDING_CATEGORIES');
    const getSpendingContent = useContent('SPENDING_BREAKDOWN');

    if(!categoryTotals) {
        // TODO: Actual loading animation
        return 'Loading...';
    }

    const categoryTotalList = Object.keys(categoryTotals);
    let sortedList = categoryTotalList.map(key => {
        return {
            category: key,
            amount: categoryTotals[key as SpendingCategoryType]
        };
    }).sort((a, b) => a.amount < b.amount ? 1 : -1);

    const listForPieChart = sortedList;

    if(!viewAll) {
        sortedList = sortedList.filter((_, index) => index < 3);
    }

    const showAllLabel = getSpendingContent('SHOW_ALL');
    const hideLabel = getSpendingContent('HIDE');
    return (
        <div>
            <div className={styles.label}>
                {label}
            </div>
            <CategoryAmountChart amountList={listForPieChart} useDollarValues={useDollarValues} />
            {
                sortedList.map(({ category, amount }, index) => {
                    const categoryData = SPENDING_CATEGORIES[category as SpendingCategoryType];
                    const backgroundColor = categoryData.color;
                    const Icon = categoryData.icon;
                    // @ts-expect-error
                    const categoryLabel = getSpendingCategoryContent(category);
                    const displayedValue = useDollarValues ? `-$${amount.toFixed(2)}` : `x${amount}`;
                    return (
                        <button key={category}
                                className={clsx(styles.totalsPill, index > 2 && styles.fadeInAnimation)}
                                style={{ backgroundColor }}
                                aria-label={getSpendingContent('TOTAL_CATEGORY_ARIA_LABEL', [amount, categoryLabel, categoryLabel])}
                                tabIndex={0}
                                onClick={() => {
                                    setCurrentTab(TAB_ENUM.HISTORY_TAB);
                                    setFilterCategory({ code: category, name: categoryLabel });
                                }}
                        >
                            <div className={styles.icon}>
                                { Icon }
                            </div>
                            <div className={styles.categoryName}>
                                {categoryLabel}
                            </div>
                            <div className={styles.amount}>
                                {displayedValue}
                            </div>
                        </button>
                    );
                })
            }
            {
                categoryTotalList.length > 2 && (
                    <Link text={viewAll ? hideLabel : showAllLabel}
                          customClass={styles.showAllLink}
                          onClickCallback={() => setViewAll(!viewAll)}
                    />
                )
            }
        </div>
    );
}