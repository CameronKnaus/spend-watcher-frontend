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
                            heading="Total spent"
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-medium'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                amount={-spendingData.summary.total.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading="Discretionary total"
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                amount={-spendingData.summary.discretionaryTotal.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading="Recurring total"
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                amount={-spendingData.summary.recurringTotal.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    {/* Log Expense button */}
                    <CustomButton
                        variant="tertiary"
                        text={getTransactionContent('logExpense')}
                        layout="full-width"
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    />

                    {/* Log expense slide up panel */}
                    <SlideUpPanel
                        isOpen={expanded}
                        onBackButtonClick={() => setExpanded(false)}
                        title={getTransactionContent('newExpense')}
                        tagColor="var(--token-color-semantic-expense)"
                        onPanelClose={() => setExpanded(false)}
                    >
                        <ExpenseForm />
                    </SlideUpPanel>
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
