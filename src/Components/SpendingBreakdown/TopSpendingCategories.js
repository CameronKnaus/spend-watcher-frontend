import { useState } from 'react';
import styles from '../../Styles/Components/SpendingBreakdown/TopSpendingCategories.module.css';
import { SPENDING_CATEGORIES } from 'Constants/categories';
import useContent from '../../CustomHooks/useContent';
import Link from '../UIElements/Navigation/Link';

export default function TopSpendingCategories({ categoryTotals }) {
    const [viewAll, setViewAll] = useState(false);
    const getContent = useContent();
    const getSpendingContent = (...args) => getContent('SPENDING_BREAKDOWN', ...args);

    if(!categoryTotals) {
        // TODO: Actual loading animation
        return 'Loading...';
    }

    let sortedList = Object.keys(categoryTotals).map(key => {
        return {
            category: key,
            amount: categoryTotals[key]
        };
    }).sort((a, b) => a.amount < b.amount ? 1 : -1);

    if(!viewAll) {
        sortedList = sortedList.filter((_, index) => index < 3);
    }

    const showAllLabel = getSpendingContent('SHOW_ALL');
    const hideLabel = getSpendingContent('HIDE');
    return (
        <div>
            <div>
                { getSpendingContent('CATEGORY_TOTAL_TITLE') }
            </div>
            {
                sortedList.map(({ category, amount }) => {
                    const categoryData = SPENDING_CATEGORIES[category];
                    const backgroundColor = categoryData.color;
                    const Icon = categoryData.icon;
                    const categoryLabel = getContent('SPENDING_CATEGORIES', category);
                    return (
                        <button key={category}
                                className={styles.totalsPill}
                                style={{ backgroundColor }}
                                aria-label={getSpendingContent('TOTAL_CATEGORY_ARIA_LABEL', [amount, categoryLabel, categoryLabel])}
                                tabIndex={0}
                        >
                            <div className={styles.icon}>
                                { Icon }
                            </div>
                            <div className={styles.categoryName}>
                                {categoryLabel}
                            </div>
                            <div className={styles.amount}>
                                {`-$${amount.toFixed(2)}`}
                            </div>
                        </button>
                    );
                })
            }
            {
                sortedList.length > 2 && (
                    <Link text={viewAll ? hideLabel : showAllLabel}
                          customClass={styles.showAllLink}
                          onClickCallback={() => setViewAll(!viewAll)}
                    />
                )
            }
        </div>
    );
}