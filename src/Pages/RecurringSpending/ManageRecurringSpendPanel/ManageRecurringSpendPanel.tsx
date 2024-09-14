import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import { RecurringSpendTransaction } from 'Types/Services/spending.model';
import DeleteRecurringSpeedBump from './DeleteRecurringSpeedBump/DeleteRecurringSpeedBump';

type ManageRecurringSpendPanelPropTypes = {
    recurringSpendTransaction?: RecurringSpendTransaction;
    onPanelClose: () => void;
};

export default function ManageRecurringSpendPanel({
    recurringSpendTransaction,
    onPanelClose,
}: ManageRecurringSpendPanelPropTypes) {
    return (
        <SlideUpPanel
            isOpen={Boolean(recurringSpendTransaction)}
            title="placeholder"
            onPanelClose={onPanelClose}
            tagColor="var(--token-color-semantic-expense)"
        >
            {/* <RecurringExpenseForm onCancel={onPanelClose} expenseToEdit={recurringSpendTransaction} /> */}
            {recurringSpendTransaction && (
                <DeleteRecurringSpeedBump
                    recurringSpendTransaction={recurringSpendTransaction}
                    handleCancel={onPanelClose}
                    onDeletion={() => {}}
                />
            )}
        </SlideUpPanel>
    );
}
