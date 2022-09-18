import { useState } from 'react';
import styles from '../../Styles/Components/SpendingBreakdown/TopSpendingCategories.module.css';
import { SPENDING_CATEGORIES } from 'Constants/categories';
import useContent from '../../CustomHooks/useContent';
import Link from '../UIElements/Navigation/Link';
import clsx from 'clsx';
import { TAB_ENUM } from '../../Pages/SpendingBreakdown';
import CategoryAmountChart from '../UIElements/DataVisualization/CategoryAmountChart';

export default function TopSpendingCategories({ label, categoryTotals, setCurrentTab, setFilterCategory, useDollarValues }) {
    const [viewAll, setViewAll] = useState(false);
    const getContent = useContent();
    const getSpendingContent = (...args) => getContent('SPENDING_BREAKDOWN', ...args);

    if(!categoryTotals) {
        // TODO: Actual loading animation
        return 'Loading...';
    }

    const categoryTotalList = Object.keys(categoryTotals);
    let sortedList = categoryTotalList.map(key => {
        return {
            category: key,
            amount: categoryTotals[key]
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
                    const categoryData = SPENDING_CATEGORIES[category];
                    const backgroundColor = categoryData.color;
                    const Icon = categoryData.icon;
                    const categoryLabel = getContent('SPENDING_CATEGORIES', category);
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