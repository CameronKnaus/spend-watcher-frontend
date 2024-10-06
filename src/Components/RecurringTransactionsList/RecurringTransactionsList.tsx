import EditableRecurringTransactionRow from 'Components/EditableRecurringTransactionRow';
import useRecurringTransactionsList from 'Hooks/useRecurringTransactionsList/useRecurringTransactionsList';
import { RecurringSpendTransaction } from 'Types/Services/spending.model';

type RecurringTransactionsListPropTypes = {
    recurringSpendId: RecurringSpendTransaction['recurringSpendId'];
    expectedMonthlyAmount: number;
};

export default function RecurringTransactionsList({
    recurringSpendId,
    expectedMonthlyAmount,
}: RecurringTransactionsListPropTypes) {
    const { recurringTransactionsList, isLoading } = useRecurringTransactionsList(recurringSpendId);

    if (!recurringTransactionsList || isLoading) {
        // TODO:
        return <h1>Loading...</h1>;
    }

    return (
        <>
            {recurringTransactionsList.map((transaction) => {
                return (
                    <EditableRecurringTransactionRow
                        key={transaction.date}
                        date={transaction.date}
                        transactionId={transaction.transactionId}
                        amountSpent={transaction.amountSpent}
                        expectedMonthlyAmount={expectedMonthlyAmount}
                    />
                );
            })}
        </>
    );
}
