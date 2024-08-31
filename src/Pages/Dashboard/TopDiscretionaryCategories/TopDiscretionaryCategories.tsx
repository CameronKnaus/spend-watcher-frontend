import useSpendingDetailsService from 'Hooks/useSpendingService/useSpendingDetailsService';
import styles from './TopDiscretionaryCategories.module.css';
import useContent from 'Hooks/useContent';
import { useEffect, useRef, useState } from 'react';
import CustomButton from 'Components/CustomButton/CustomButton';
import { SpendingCategory } from 'Types/spendTransactionTypes';
import TopCategoryLabel from './TopCategoryLabel/TopCategoryLabel';
import roundNumber from 'Util/Calculations/roundNumber';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import TopCategoryLabelLoader from './TopCategoryLabel/TopCategoryLabelLoader';

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

    const list = spendingData.categoryDetailsList.slice(0, 4);
    const topFourTotalAmount = roundNumber(list.reduce((acc, details) => acc + details.amount, 0));
    const topFourTotalPercentage = roundNumber(
        list.reduce((acc, details) => acc + details.percentageOfDiscretionarySpend, 0),
    );

    const otherCategoriesTotalAmount = roundNumber(spendingData.summary.discretionaryTotal.amount - topFourTotalAmount);
    const otherCategoriesTotalPercentage = roundNumber(100 - topFourTotalPercentage);

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
                            width: `${details.percentageOfDiscretionarySpend}%`,
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
                        amount={-details.amount}
                        percentage={details.percentageOfDiscretionarySpend}
                        category={details.category}
                    />
                ))}
                <TopCategoryLabel
                    label={getContent('topFour')}
                    isVerticalList={isVerticalList}
                    amount={-topFourTotalAmount}
                    percentage={topFourTotalPercentage}
                    category={SpendingCategory.OTHER}
                    customIconStyles={{
                        background: `linear-gradient(to right, ${list.map((details) => `var(--theme-color-spend-category-${details.category})`).join(', ')})`,
                    }}
                />
                <TopCategoryLabel
                    label={getContent('other')}
                    isVerticalList={isVerticalList}
                    amount={-otherCategoriesTotalAmount}
                    percentage={otherCategoriesTotalPercentage}
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
