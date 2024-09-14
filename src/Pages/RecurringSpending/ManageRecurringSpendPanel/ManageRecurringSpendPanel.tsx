import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import RecurringExpenseForm from 'Components/RecurringExpenseForm/RecurringExpenseForm';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import useContent from 'Hooks/useContent';
import { useEffect, useState } from 'react';
import { RecurringSpendTransaction } from 'Types/Services/spending.model';
import DeleteRecurringSpeedBump from './DeleteRecurringSpeedBump/DeleteRecurringSpeedBump';
import styles from './ManageRecurringSpendPanel.module.css';

type ManageRecurringSpendPanelPropTypes = {
    recurringSpendTransaction?: RecurringSpendTransaction;
    onPanelClose: () => void;
};

enum ManageRecurringSpendPanels {
    base = 'base',
    edit = 'edit',
    delete = 'delete',
}

export default function ManageRecurringSpendPanel({
    recurringSpendTransaction,
    onPanelClose,
}: ManageRecurringSpendPanelPropTypes) {
    const getContent = useContent('recurringSpending');
    const [currentPanelContents, setCurrentPanelContents] = useState(ManageRecurringSpendPanels.base);

    useEffect(() => {
        returnToBase();
    }, [recurringSpendTransaction]);

    function returnToBase() {
        setCurrentPanelContents(ManageRecurringSpendPanels.base);
    }

    function getTagTitle() {
        const spendName = recurringSpendTransaction?.recurringSpendName;
        if (!spendName) {
            return '';
        }

        if (currentPanelContents === ManageRecurringSpendPanels.edit) {
            return getContent('editingTransaction', [spendName]);
        }

        if (currentPanelContents === ManageRecurringSpendPanels.delete) {
            return getContent('deletingTransaction', [spendName]);
        }

        return spendName;
    }

    return (
        <SlideUpPanel
            isOpen={Boolean(recurringSpendTransaction)}
            title={getTagTitle()}
            onPanelClose={onPanelClose}
            tagColor="var(--token-color-semantic-expense)"
        >
            <>
                {currentPanelContents === ManageRecurringSpendPanels.base && (
                    <>
                        <h3 className={styles.header}>{getContent('chooseOption')}</h3>
                        <CustomButton
                            layout="fit-content"
                            className={styles.optionButton}
                            variant="secondary"
                            onClick={() => setCurrentPanelContents(ManageRecurringSpendPanels.edit)}
                        >
                            {getContent('edit')}
                        </CustomButton>
                        <CustomButton
                            className={styles.optionButton}
                            variant="secondary"
                            layout="fit-content"
                            onClick={() => setCurrentPanelContents(ManageRecurringSpendPanels.delete)}
                        >
                            {getContent('permanentlyDelete')}
                        </CustomButton>
                        <BottomSheet>
                            <CustomButton layout="full-width" variant="secondary" onClick={onPanelClose}>
                                {getContent('cancel')}
                            </CustomButton>
                        </BottomSheet>
                    </>
                )}
                {currentPanelContents === ManageRecurringSpendPanels.edit && (
                    <RecurringExpenseForm onCancel={returnToBase} expenseToEdit={recurringSpendTransaction} />
                )}
                {recurringSpendTransaction && currentPanelContents === ManageRecurringSpendPanels.delete && (
                    <DeleteRecurringSpeedBump
                        recurringSpendTransaction={recurringSpendTransaction}
                        handleCancel={returnToBase}
                        onDeletion={() => {}}
                    />
                )}
            </>
        </SlideUpPanel>
    );
}
