import Currency from 'Components/Currency/Currency';
import CustomButton from 'Components/CustomButton/CustomButton';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import NewRecurringExpenseForm from 'Components/NewRecurringExpenseForm/NewRecurringExpenseForm';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import useRecurringSummaryService from 'Hooks/useRecurringSummaryService';
import { useState } from 'react';
import styles from './RecurringSpending.module.css';
import RecurringTransactionCard from './RecurringTransactionCard/RecurringTransactionCard';

export default function RecurringSpending() {
    const [newSpendFormOpen, setNewSpendFormOpen] = useState(false);
    const getContent = useContent('recurringSpending');
    const currentMonth = format(new Date(), 'LLLL');
    const { data: summaryData } = useRecurringSummaryService();

    if (!summaryData) {
        // TODO: Loader
        return 'Loading...';
    }

    const activeList = summaryData.activeRecurringTransactions;
    const inactiveList = summaryData.inactiveRecurringTransactions;
    return (
        <>
            <div className={styles.recurringSpending}>
                <h1 className={styles.pageTitle}>{getContent('pageTitle')}</h1>
                <div className={styles.pageContainer}>
                    <div className={styles.sideBarContainer}>
                        <CustomButton
                            variant="tertiary"
                            layout="full-width"
                            onClick={() => setNewSpendFormOpen(true)}
                            className={styles.createNewExpenseButton}
                        >
                            {getContent('createNew')}
                        </CustomButton>
                        <ModuleContainer className={styles.totalsContainer}>
                            <span>{getContent('averageMonthlyTotal')}</span>
                            <Currency amount={-summaryData.averageEstimatedMonthlyTotal} isGainLoss />
                            <span>{getContent('monthActualTotal', [currentMonth])}</span>
                            <Currency amount={-summaryData.actualMonthlyTotal} isGainLoss />
                        </ModuleContainer>
                    </div>
                    <div className={styles.contentContainer}>
                        <h2 className={styles.contentTitle}>{getContent('monthlyTransactions')}</h2>
                        <div className={styles.transactionsContainer}>
                            {activeList.map((transaction) => (
                                <div key={transaction.transactionId} className={styles.cardContainer}>
                                    <RecurringTransactionCard transaction={transaction} />
                                </div>
                            ))}
                        </div>
                        {inactiveList.length > 0 && (
                            <>
                                <h2 className={styles.contentTitle}>{getContent('inactiveTransactions')}</h2>
                                {inactiveList.map((transaction) => (
                                    <div key={transaction.transactionId} className={styles.cardContainer}>
                                        <RecurringTransactionCard transaction={transaction} />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <SlideUpPanel
                isOpen={newSpendFormOpen}
                title={getContent('newRecurringExpenseTitle')}
                tagColor="var(--token-color-semantic-expense)"
                onPanelClose={() => setNewSpendFormOpen(false)}
            >
                <NewRecurringExpenseForm onCancel={() => setNewSpendFormOpen(false)} />
            </SlideUpPanel>
        </>
    );
}
