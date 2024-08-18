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

export default function Dashboard() {
    const getContent = useContent('DASHBOARD');
    const [expanded, setExpanded] = useState(false);
    const currentMonth = format(new Date(), 'LLLL');

    const { isLoading, isFetching, data: spendingData } = useSpendingDetailsService();

    if (isLoading || isFetching || !spendingData) {
        return <h1>Placeholder loading</h1>;
    }

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.spendingSectionTitle}>{getContent('MONTH_OVERVIEW', [currentMonth])}</h2>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        <ModuleContainer
                            heading="Total spent"
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-medium'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                value={-spendingData.summary.total.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading="Discretionary total"
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                value={-spendingData.summary.discretionaryTotal.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                        <ModuleContainer
                            heading="Recurring total"
                            className={clsx([styles.summaryTile, 'background-secondary-elevation-low'])}
                        >
                            <Currency
                                className="font-heading-medium font-thin"
                                value={-spendingData.summary.recurringTotal.amount}
                                isGainLoss
                            />
                        </ModuleContainer>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <CustomButton
                        variant="tertiary"
                        text="Log Expense"
                        layout="full-width"
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    />
                    <SlideUpPanel
                        isOpen={expanded}
                        onBackButtonClick={() => setExpanded(false)}
                        title="New expense"
                        tagColor="var(--token-color-semantic-expense)"
                        onPanelClose={() => setExpanded(false)}
                    >
                        <ExpenseForm />
                    </SlideUpPanel>
                </div>
            </div>
        </div>
    );
}
