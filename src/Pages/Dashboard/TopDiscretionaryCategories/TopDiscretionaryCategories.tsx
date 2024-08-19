import useSpendingDetailsService from 'Hooks/useSpendingService/useSpendingDetailsService';
import styles from './TopDiscretionaryCategories.module.css';
import roundNumber from 'Util/Calculations/roundNumber';

export default function TopDiscretionaryCategories() {
    const { data: spendingData } = useSpendingDetailsService();

    if (!spendingData) {
        return null;
    }

    // TODO: Currently recurring and discretionary totals are combined for category totals, split them
    const list = spendingData.categoryTrends.categoryList.slice(0, 4);
    const percentageOther = roundNumber(
        100 - list.reduce((acc, item) => acc + item.percentageOfDiscretionarySpend, 0),
        0,
    );

    return (
        <div className={styles.topDiscretionaryCategories}>
            <div className={styles.percentageBar}>
                {list.map((details) => (
                    <div
                        key={details.category}
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
                        width: `${percentageOther}%`,
                        backgroundColor: 'var(--theme-color-neutral-500)',
                    }}
                />
            </div>
        </div>
    );
}
