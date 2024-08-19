import useSpendingDetailsService from 'Hooks/useSpendingService/useSpendingDetailsService';
import styles from './TopDiscretionaryCategories.module.css';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import useContent from 'Hooks/useContent';
import Currency from 'Components/Currency/Currency';
import { useEffect, useRef, useState } from 'react';

export default function TopDiscretionaryCategories() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: spendingData } = useSpendingDetailsService();
    const getCategoryLabel = useContent('SPENDING_CATEGORIES');
    const [isVerticalList, setIsVerticalList] = useState(false);

    useEffect(() => {
        const categoryContainer = containerRef.current;
        if (!categoryContainer) {
            return;
        }

        function handleResize() {
            if (categoryContainer) {
                setIsVerticalList(categoryContainer.clientWidth < 550);
                console.log(containerRef.current?.clientWidth);
            }
        }

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!spendingData) {
        return null;
    }

    const list = spendingData.categoryDetailsList.slice(0, 4);

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
                        backgroundColor: 'var(--theme-color-neutral-500)',
                    }}
                />
            </div>
            <div className={styles.categoryList}>
                {list.map((details) => (
                    <div
                        key={`${details.category}-description`}
                        className={styles.categoryListItem}
                        style={{ flexBasis: isVerticalList ? '100%' : 'calc(50% - var(--category-list-item-gap))' }}
                    >
                        <SpendingCategoryIcon category={details.category} size={20} className={styles.categoryIcon} />
                        <span>{getCategoryLabel(details.category)}</span>
                        <div className={styles.amountContainer}>
                            <Currency amount={-details.amount} isGainLoss />
                            <span>{`| ${details.percentageOfDiscretionarySpend}%`}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
