import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import EditableRecurringTransactionRow from 'Components/EditableRecurringTransactionRow';
import { format, parse } from 'date-fns';
import useContent from 'Hooks/useContent';
import useRecurringTransactionsList from 'Hooks/useRecurringTransactionsList/useRecurringTransactionsList';
import { RecurringSpendTransaction } from 'Types/Services/spending.model';
import styles from './RecurringTransactionList.module.css';

type RecurringTransactionsListPropTypes = {
    recurringSpendId: RecurringSpendTransaction['recurringSpendId'];
    expectedMonthlyAmount: number;
    onBack: () => void;
};

const formatDate = (date: string) => format(parse(date, 'yyyy-MM', new Date()), 'MMMM yyyy');

export default function RecurringTransactionsList({
    recurringSpendId,
    expectedMonthlyAmount,
    onBack,
}: RecurringTransactionsListPropTypes) {
    const { recurringTransactionsList, isLoading } = useRecurringTransactionsList(recurringSpendId);
    const getContent = useContent('recurringTransactionsList');

    if (!recurringTransactionsList || isLoading) {
        // TODO:
        return <h1>Loading...</h1>;
    }

    const oldestTransactionDate = recurringTransactionsList[recurringTransactionsList.length - 1].date;
    // Starting with the current date, we will iterate backwards until we reach the oldest transaction date
    const currentDate = new Date();
    const applicableMonths = [];
    let lastTransactionDateReached = false;
    while (!lastTransactionDateReached) {
        const formattedCurrentDate = format(currentDate, 'yyyy-MM');
        applicableMonths.push(formattedCurrentDate);

        if (formattedCurrentDate === oldestTransactionDate) {
            lastTransactionDateReached = true;
        }

        // Update current date to the previous month for next iteration
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return (
        <>
            {applicableMonths.map((date) => {
                const transaction = recurringTransactionsList.find((transaction) => transaction.date === date);
                const formattedDate = formatDate(date);

                if (transaction) {
                    // Month already has transaction logged
                    return (
                        <EditableRecurringTransactionRow
                            key={`${transaction.date}-${transaction.amountSpent}`}
                            label={formattedDate}
                            transactionId={transaction.transactionId}
                            amountSpent={transaction.amountSpent}
                            expectedMonthlyAmount={expectedMonthlyAmount}
                        />
                    );
                }

                // Month has no transaction logged
                return (
                    <CustomButton key={date} layout="full-width" className={styles.addNewRow}>
                        {getContent('addNewRow', [formattedDate])}
                    </CustomButton>
                );
            })}
            <BottomSheet>
                <CustomButton variant="secondary" onClick={onBack} layout="full-width">
                    {getContent('backButton')}
                </CustomButton>
            </BottomSheet>
        </>
    );
}
