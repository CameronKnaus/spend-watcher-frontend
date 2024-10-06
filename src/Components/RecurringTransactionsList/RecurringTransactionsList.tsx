import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import EditableRecurringTransactionRow from 'Components/EditableRecurringTransactionRow';
import useContent from 'Hooks/useContent';
import useRecurringTransactionsList from 'Hooks/useRecurringTransactionsList/useRecurringTransactionsList';
import { RecurringSpendTransaction } from 'Types/Services/spending.model';

type RecurringTransactionsListPropTypes = {
    recurringSpendId: RecurringSpendTransaction['recurringSpendId'];
    expectedMonthlyAmount: number;
    onBack: () => void;
};

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

    return (
        <>
            {recurringTransactionsList.map((transaction) => (
                <EditableRecurringTransactionRow
                    key={transaction.date}
                    date={transaction.date}
                    transactionId={transaction.transactionId}
                    amountSpent={transaction.amountSpent}
                    expectedMonthlyAmount={expectedMonthlyAmount}
                />
            ))}
            <BottomSheet>
                <CustomButton variant="secondary" onClick={onBack} layout="full-width">
                    {getContent('backButton')}
                </CustomButton>
            </BottomSheet>
        </>
    );
}
