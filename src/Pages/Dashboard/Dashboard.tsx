import styles from './Dashboard.module.css';
import { format } from 'date-fns';
import CustomButton from 'Components/CustomButton/CustomButton';
import { useState } from 'react';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import { clsx } from 'clsx';
import Currency from 'Components/Currency/Currency';
import ExpenseForm from 'Components/ExpenseForm/ExpenseForm';
import useSpendingDetailsService from 'Hooks/useSpendingService';
import useContent from 'Hooks/useContent';
import RecentTransactions from './RecentTransactions';
import TopDiscretionaryCategories from './TopDiscretionaryCategories';

export default function Dashboard() {
    // TODO: Rename expand here to something more pertinent to log expense panel
    const [expanded, setExpanded] = useState(false);
    const getContent = useContent('dashboard');
    const getTransactionContent = useContent('transactions');
    const currentMonth = format(new Date(), 'LLLL');

    const { isLoading, isFetching, data: spendingData } = useSpendingDetailsService();

    if (isLoading || isFetching || !spendingData) {
        return <h1>Placeholder loading</h1>;
    }

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.spendingSectionTitle}>{getContent('monthOverview', [currentMonth])}</h2>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        <ModuleContainer
                            heading={getContent('totalSpent')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-medium'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                amount={-spendingData.summary.total.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading={getContent('discretionaryTotal')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                amount={-spendingData.summary.discretionaryTotal.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading={getContent('recurringTotal')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                amount={-spendingData.summary.recurringTotal.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading={getContent('spendRatio')}
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            Placeholder dummy
                        </ModuleContainer>
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
                            setExpanded(!expanded);
                        }}
                        className={styles.logExpenseButton}
                    >
                        {getTransactionContent('logExpense')}
                    </CustomButton>

                    {/* Log expense slide up panel */}
                    <SlideUpPanel
                        isOpen={expanded}
                        onBackButtonClick={() => setExpanded(false)}
                        title={getTransactionContent('newExpense')}
                        tagColor="var(--token-color-semantic-expense)"
                    >
                        <ExpenseForm />
                    </SlideUpPanel>
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
