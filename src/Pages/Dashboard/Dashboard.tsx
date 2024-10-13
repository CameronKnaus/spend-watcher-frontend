import { clsx } from 'clsx';
import CustomButton from 'Components/CustomButton/CustomButton';
import DiscretionarySpendPanel from 'Components/DiscretionarySpendForm/DiscretionarySpendPanel';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { useIsMobile } from 'Util/IsMobileContext';
import styles from './Dashboard.module.css';
import RecentTransactions from './RecentTransactions';
import SummaryTotals from './SummaryTotals/SummaryTotals';
import TopDiscretionaryCategories from './TopDiscretionaryCategories';

export default function Dashboard() {
    const isMobile = useIsMobile();
    const [logExpensePanelOpen, setLogExpensePanelOpen] = useState(false);
    const getContent = useContent('dashboard');
    const getTransactionContent = useContent('transactions');
    const currentMonth = format(new Date(), 'LLLL');

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.spendingSectionTitle}>{getContent('monthOverview', [currentMonth])}</h1>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        <SummaryTotals />
                        {/* Spend ratio */}
                        {!isMobile && (
                            <ModuleContainer
                                heading={getContent('spendRatio')}
                                className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                            >
                                Placeholder dummy
                            </ModuleContainer>
                        )}

                        {/* Top categories */}
                        <ModuleContainer
                            heading={getContent('topCategories')}
                            className={clsx([styles.topCategoriesTile, 'background-secondary-elevation-low'])}
                        >
                            <TopDiscretionaryCategories />
                        </ModuleContainer>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    {/* Log Expense button */}
                    <CustomButton
                        variant="tertiary"
                        layout="full-width"
                        onClick={() => {
                            setLogExpensePanelOpen(true);
                        }}
                        className={styles.logExpenseButton}
                    >
                        {getTransactionContent('logExpense')}
                    </CustomButton>
                    <RecentTransactions />
                </div>
            </div>

            {/* Log expense slide up panel */}
            <DiscretionarySpendPanel onPanelClose={() => setLogExpensePanelOpen(false)} isOpen={logExpensePanelOpen} />
        </div>
    );
}
