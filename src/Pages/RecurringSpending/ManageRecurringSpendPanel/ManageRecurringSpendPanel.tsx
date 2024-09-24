import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import RecurringExpenseForm from 'Components/RecurringExpenseForm/RecurringExpenseForm';
import SpeedBump from 'Components/SlideUpPanel/Addons/SpeedBump/SpeedBump';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdUpdate, MdUpdateDisabled } from 'react-icons/md';
import {
    DeleteRecurringSpendRequestParams,
    RecurringSpendTransaction,
    SetActiveRecurringSpendRequestParams,
} from 'Types/Services/spending.model';
import styles from './ManageRecurringSpendPanel.module.css';

type ManageRecurringSpendPanelPropTypes = {
    recurringSpendTransaction?: RecurringSpendTransaction;
    closePanel: () => void;
};

enum ManageRecurringSpendPanels {
    base = 'base',
    edit = 'edit',
    setInactive = 'setInactive',
    setActive = 'setActive',
    delete = 'delete',
}

export default function ManageRecurringSpendPanel({
    recurringSpendTransaction,
    closePanel,
}: ManageRecurringSpendPanelPropTypes) {
    const getContent = useContent('recurringSpending');
    const getGeneralContent = useContent('general');
    const [currentPanelContents, setCurrentPanelContents] = useState(ManageRecurringSpendPanels.base);
    const queryClient = useQueryClient();

    function invalidateRecurring() {
        queryClient.invalidateQueries({
            queryKey: ['recurring'],
        });
        queryClient.invalidateQueries({
            queryKey: ['spending'],
        });
    }

    const deleteMutation = useMutation({
        mutationFn: (params: DeleteRecurringSpendRequestParams) =>
            axios.post(SERVICE_ROUTES.postDeleteRecurringSpend, params),
        onSuccess: () => {
            invalidateRecurring();
        },
        onError: () => {
            // TODO: Error handling
        },
    });
    const activeStatusMutation = useMutation({
        mutationFn: (params: SetActiveRecurringSpendRequestParams) =>
            axios.post(SERVICE_ROUTES.postUpdateRecurringSpendStatus, params),
        onSuccess: () => {
            invalidateRecurring();
        },
        onError: () => {
            // TODO: Error handling
        },
    });

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

    const panelIsSetActive = currentPanelContents === ManageRecurringSpendPanels.setActive;
    const panelIsChangingActiveStatus =
        panelIsSetActive || currentPanelContents === ManageRecurringSpendPanels.setInactive;
    return (
        <SlideUpPanel
            isOpen={Boolean(recurringSpendTransaction)}
            title={getTagTitle()}
            handlePanelWillClose={closePanel}
            tagColor="var(--token-color-semantic-expense)"
        >
            <>
                {currentPanelContents === ManageRecurringSpendPanels.base && (
                    <>
                        <h3 className={styles.header}>{getContent('chooseOption')}</h3>
                        <div className={styles.buttonContainer}>
                            <CustomButton
                                layout="fit-content"
                                className={styles.optionButton}
                                variant="secondary"
                                onClick={() => setCurrentPanelContents(ManageRecurringSpendPanels.edit)}
                            >
                                <FaEdit size={20} />
                                {getContent('edit')}
                            </CustomButton>
                            <CustomButton
                                layout="fit-content"
                                className={styles.optionButton}
                                variant="secondary"
                                onClick={() =>
                                    setCurrentPanelContents(
                                        recurringSpendTransaction?.isActive
                                            ? ManageRecurringSpendPanels.setInactive
                                            : ManageRecurringSpendPanels.setActive,
                                    )
                                }
                            >
                                {recurringSpendTransaction?.isActive ? (
                                    <MdUpdateDisabled size={20} />
                                ) : (
                                    <MdUpdate size={20} />
                                )}
                                {getContent(recurringSpendTransaction?.isActive ? 'markInactive' : 'markActive')}
                            </CustomButton>
                            <CustomButton
                                className={styles.optionButton}
                                variant="secondary"
                                layout="fit-content"
                                onClick={() => setCurrentPanelContents(ManageRecurringSpendPanels.delete)}
                            >
                                <FaTrashAlt size={20} />
                                {getContent('permanentlyDelete')}
                            </CustomButton>
                        </div>
                        <BottomSheet>
                            <CustomButton layout="full-width" variant="secondary" onClick={closePanel}>
                                {getContent('cancel')}
                            </CustomButton>
                        </BottomSheet>
                    </>
                )}
                {currentPanelContents === ManageRecurringSpendPanels.edit && (
                    <RecurringExpenseForm
                        onCancel={returnToBase}
                        onSubmit={closePanel}
                        expenseToEdit={recurringSpendTransaction}
                    />
                )}
                {recurringSpendTransaction && currentPanelContents === ManageRecurringSpendPanels.delete && (
                    <SpeedBump
                        warningTitle={getContent('deleteSpeedBumpHeader')}
                        warningDescription={getContent('deleteSpeedBumpDescription', [
                            recurringSpendTransaction.recurringSpendName,
                        ])}
                        proceedText={getGeneralContent('delete')}
                        finalWarningText={getContent('finalDeletionWarning')}
                        onCancel={returnToBase}
                        onProceed={() => {
                            deleteMutation.mutate({
                                recurringSpendId: recurringSpendTransaction.recurringSpendId,
                            });
                            closePanel();
                        }}
                    />
                )}
                {recurringSpendTransaction && panelIsChangingActiveStatus && (
                    <SpeedBump
                        warningTitle={getContent(panelIsSetActive ? 'setActiveTitle' : 'setInactiveTitle')}
                        warningDescription={getContent(
                            panelIsSetActive ? 'setActiveDescription' : 'setInactiveDescription',
                        )}
                        proceedText={getGeneralContent('confirm')}
                        onCancel={returnToBase}
                        onProceed={() => {
                            activeStatusMutation.mutate({
                                recurringSpendId: recurringSpendTransaction.recurringSpendId,
                                isActive: panelIsSetActive,
                            });
                            closePanel();
                        }}
                    />
                )}
            </>
        </SlideUpPanel>
    );
}
