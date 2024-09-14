import { clsx } from 'clsx';
import Currency from 'Components/Currency/Currency';
import CustomButton from 'Components/CustomButton/CustomButton';
import DiscretionarySpendPanel from 'Components/DiscretionarySpendForm/DiscretionarySpendPanel';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import useSpendingDetailsService from 'Hooks/useSpendingService';
import { useState } from 'react';
import styles from './Dashboard.module.css';
import RecentTransactions from './RecentTransactions';
import TopDiscretionaryCategories from './TopDiscretionaryCategories';

export default function Dashboard() {
    const [logExpensePanelOpen, setLogExpensePanelOpen] = useState(false);
    const getContent = useContent('dashboard');
    const getTransactionContent = useContent('transactions');
    const currentMonth = format(new Date(), 'LLLL');

    const { isLoading, isFetching, data: spendingData } = useSpendingDetailsService();
    const pageLoading = !spendingData || isLoading || isFetching;

    const totalsSkeletonLoaderStyle = { height: 30, maxWidth: 130 };
    return (
        <div className={styles.dashboard}>
            <h1 className={styles.spendingSectionTitle}>{getContent('monthOverview', [currentMonth])}</h1>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        {/* Total spent */}
                        <ModuleContainer
                            heading={getContent('totalSpent')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-medium'])}
                        >
                            {pageLoading ? (
                                <SkeletonLoader style={totalsSkeletonLoaderStyle} />
                            ) : (
                                <Currency
                                    className="font-heading-medium font-thin"
                                    amount={-spendingData.summary.total.amount}
                                    isGainLoss
                                />
                            )}
                        </ModuleContainer>

                        {/* Discretionary total */}
                        <ModuleContainer
                            heading={getContent('discretionaryTotal')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            {pageLoading ? (
                                <SkeletonLoader style={totalsSkeletonLoaderStyle} />
                            ) : (
                                <Currency
                                    className="font-heading-medium font-thin"
                                    amount={-spendingData.summary.discretionaryTotal.amount}
                                    isGainLoss
                                />
                            )}
                        </ModuleContainer>

                        {/* Recurring total */}
                        <ModuleContainer
                            heading={getContent('recurringTotal')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            {pageLoading ? (
                                <SkeletonLoader style={totalsSkeletonLoaderStyle} />
                            ) : (
                                <Currency
                                    className="font-heading-medium font-thin"
                                    amount={-spendingData.summary.recurringTotal.amount}
                                    isGainLoss
                                />
                            )}
                        </ModuleContainer>

                        {/* Spend ratio */}
                        <ModuleContainer
                            heading={getContent('spendRatio')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            Placeholder dummy
                        </ModuleContainer>

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
