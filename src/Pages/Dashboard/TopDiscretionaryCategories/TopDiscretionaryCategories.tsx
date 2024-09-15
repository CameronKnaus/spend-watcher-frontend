import CustomButton from 'Components/CustomButton/CustomButton';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import useContent from 'Hooks/useContent';
import useSpendingDetailsService from 'Hooks/useSpendingService/useSpendingDetailsService';
import { useEffect, useRef, useState } from 'react';
import { SpendingCategory } from 'Types/SpendingCategory';
import TopCategoryLabel from './TopCategoryLabel/TopCategoryLabel';
import TopCategoryLabelLoader from './TopCategoryLabel/TopCategoryLabelLoader';
import styles from './TopDiscretionaryCategories.module.css';

export default function TopDiscretionaryCategories() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: spendingData, isLoading } = useSpendingDetailsService();
    const getCategoryLabel = useContent('SPENDING_CATEGORIES');
    const getContent = useContent('spendingData');
    const [isVerticalList, setIsVerticalList] = useState(false);

    useEffect(() => {
        const categoryContainer = containerRef.current;
        if (!categoryContainer) {
            return;
        }

        function handleResize() {
            if (categoryContainer) {
                setIsVerticalList(categoryContainer.clientWidth < 550);
            }
        }

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Loaders
    if (!spendingData || isLoading) {
        return (
            <div ref={containerRef} className={styles.topDiscretionaryCategories}>
                <div className={styles.percentageBar}>
                    <SkeletonLoader />
                </div>
                <div className={styles.categoryList}>
                    <TopCategoryLabelLoader isVerticalList={isVerticalList} />
                    <TopCategoryLabelLoader isVerticalList={isVerticalList} />
                    <TopCategoryLabelLoader isVerticalList={isVerticalList} />
                    <TopCategoryLabelLoader isVerticalList={isVerticalList} />
                    <TopCategoryLabelLoader isVerticalList={isVerticalList} />
                    <TopCategoryLabelLoader isVerticalList={isVerticalList} />
                </div>
                <CustomButton variant="secondary" className={styles.moreButton} isDisabled>
                    {getContent('moreLabel')}
                </CustomButton>
            </div>
        );
    }

    const { spendCategoryOverview } = spendingData;
    // Sort by discretionary totals and get the top 4
    const list = spendCategoryOverview.categoryDetailsList
        .sort((a, b) => b.discretionaryTotals.amount - a.discretionaryTotals.amount)
        .slice(0, 4);

    const otherCategoriesColor = 'var(--theme-color-neutral-500)';

    return (
        <div ref={containerRef} className={styles.topDiscretionaryCategories}>
            <div className={styles.percentageBar}>
                {list.map((details) => (
                    <div
                        key={`${details.category}-percentage-bar`}
                        id={`${details.category}-percentage-bar`}
                        className={styles.percentageBarGroup}
                        style={{
                            width: `${details.discretionaryTotals.percentageOfTotalAmount}%`,
                            backgroundColor: `var(--theme-color-spend-category-${details.category})`,
                        }}
                    />
                ))}
                <div
                    id={`leftover-percentage-bar`}
                    className={styles.percentageBarGroup}
                    style={{
                        flexBasis: 0,
                        flexGrow: 1,
                        backgroundColor: otherCategoriesColor,
                    }}
                />
            </div>
            <div className={styles.categoryList}>
                {list.map((details) => (
                    <TopCategoryLabel
                        key={`${details.category}-description`}
                        label={getCategoryLabel(details.category)}
                        isVerticalList={isVerticalList}
                        amount={-details.discretionaryTotals.amount}
                        percentage={details.discretionaryTotals.percentageOfTotalAmount}
                        category={details.category}
                    />
                ))}
                <TopCategoryLabel
                    label={getContent('topFour')}
                    isVerticalList={isVerticalList}
                    amount={-spendCategoryOverview.topFourDiscretionaryTotals.amount}
                    percentage={spendCategoryOverview.topFourDiscretionaryTotals.percentageOfTotalAmount}
                    category={SpendingCategory.OTHER}
                    customIconStyles={{
                        background: `linear-gradient(to right, ${list.map((details) => `var(--theme-color-spend-category-${details.category})`).join(', ')})`,
                    }}
                />
                <TopCategoryLabel
                    label={getContent('other')}
                    isVerticalList={isVerticalList}
                    amount={-spendCategoryOverview.remainingDiscretionaryTotals.amount}
                    percentage={spendCategoryOverview.remainingDiscretionaryTotals.percentageOfTotalAmount}
                    category={SpendingCategory.OTHER}
                    customIconStyles={{
                        backgroundColor: otherCategoriesColor,
                    }}
                />
            </div>
            <CustomButton variant="secondary" onClick={() => {}} className={styles.moreButton}>
                {getContent('moreLabel')}
            </CustomButton>
        </div>
    );
}
