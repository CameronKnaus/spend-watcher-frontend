import { useEffect, useState } from 'react';
import useContent from 'CustomHooks/useContent';
import SlideUpPanel from 'Components/UIElements/Modal/SlideUpPanel/SlideUpPanel';
import RecurringSpendTransactionHistory from 'Components/RecurringSpending/RecurringSpendTransactionHistory/RecurringSpendTransactionHistory';
import RecurringSpendForm from '../RecurringSpendForm/RecurringSpendForm';
import styles from './RecurringSpendSlideInPanel.module.css';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import axios from 'axios';
import { SpendingCategoryType } from 'Constants/categories_deprecated';
import { RecurringTransaction } from 'Types/TransactionTypes';
import { EmptyCallback } from 'Types/QoLTypes';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, recurringTransactionDependentQueryKeys } from 'Util/QueryKeys';

export enum RecurringPanelOptionsEnum {
    RECURRING = 'RECURRING',
    DELETE_SPEED_BUMP = 'DELETE_SPEED_BUMP',
    HISTORY = 'HISTORY',
}

type RecurringSpendSlideInPanelPropTypes = {
    onPanelClose: EmptyCallback;
    editMode?: boolean;
    existingTransaction?: RecurringTransaction;
};

const defaultExistingTransaction: RecurringTransaction = {
    actualAmount: 0,
    category: SpendingCategoryType.OTHER,
    estimatedAmount: 0,
    expenseName: '',
    isActive: false,
    isVariableRecurring: false,
    recurringSpendId: '',
    requiresUpdate: false,
};

export default function RecurringSpendSlideInPanel({
    onPanelClose,
    editMode = false,
    existingTransaction = defaultExistingTransaction,
}: RecurringSpendSlideInPanelPropTypes) {
    const getContent = useContent('RECURRING_SPENDING');
    const [activePanelContent, setActivePanelContent] = useState(RecurringPanelOptionsEnum.RECURRING);
    const [enableForwardButton, setEnableForwardButton] = useState(true);
    const [forwardActionCallback, setForwardActionCallback] = useState<EmptyCallback>(() => {
        /* NOOP */
    });
    const [historyModified, setHistoryModified] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (activePanelContent === RecurringPanelOptionsEnum.DELETE_SPEED_BUMP) {
            setForwardActionCallback(() => {
                return () => {
                    // Handle service call
                    axios
                        .post(SERVICE_ROUTES.deleteRecurringExpense, {
                            recurringSpendId: existingTransaction.recurringSpendId,
                        })
                        .then(() => {
                            invalidateQueries(queryClient, recurringTransactionDependentQueryKeys);
                        });
                };
            });
        }
    }, [activePanelContent, existingTransaction.recurringSpendId, queryClient]);

    function renderSlideInPanelContents() {
        switch (activePanelContent) {
            case RecurringPanelOptionsEnum.RECURRING:
                return (
                    <RecurringSpendForm
                        formIsValidCallback={setEnableForwardButton}
                        editMode={editMode}
                        existingTransaction={existingTransaction}
                        setDeleteSpeedBumpActive={() =>
                            setActivePanelContent(RecurringPanelOptionsEnum.DELETE_SPEED_BUMP)
                        }
                        setForwardActionCallback={setForwardActionCallback}
                        viewHistoryTab={() => setActivePanelContent(RecurringPanelOptionsEnum.HISTORY)}
                    />
                );
            case RecurringPanelOptionsEnum.HISTORY:
                return (
                    <RecurringSpendTransactionHistory
                        recurringExpense={existingTransaction}
                        setHistoryModified={setHistoryModified}
                    />
                );
            case RecurringPanelOptionsEnum.DELETE_SPEED_BUMP:
                return (
                    <div>
                        <h3 className={styles.speedBumpHeader}>{getContent('SPEED_BUMP')}</h3>
                        <p className={styles.speedBumpDesc}>
                            {getContent('SPEED_BUMP_DESC', [existingTransaction.expenseName])}
                        </p>
                    </div>
                );
            default:
                return null;
        }
    }

    function getPanelTitle() {
        switch (activePanelContent) {
            case RecurringPanelOptionsEnum.RECURRING:
                return getContent(editMode ? 'EDIT_EXPENSE' : 'NEW_EXPENSE');
            case RecurringPanelOptionsEnum.DELETE_SPEED_BUMP:
                return getContent('DELETE_EXPENSE');
            case RecurringPanelOptionsEnum.HISTORY:
                return getContent('HISTORY_LABEL', [existingTransaction.expenseName]);
            default:
                return '';
        }
    }

    function getConfirmText() {
        switch (activePanelContent) {
            case RecurringPanelOptionsEnum.RECURRING:
                return getContent(editMode ? 'EDIT' : 'SUBMIT');
            case RecurringPanelOptionsEnum.DELETE_SPEED_BUMP:
                return getContent('DELETE');
            default:
                return '';
        }
    }

    function handlePanelClose() {
        setHistoryModified(historyModified);
        onPanelClose();
    }

    function getBackwardsActionCallback(): EmptyCallback | undefined {
        const { RECURRING } = RecurringPanelOptionsEnum;
        if (activePanelContent !== RECURRING && !historyModified) {
            return () => setActivePanelContent(RECURRING);
        }

        return void 0;
    }

    const deleteSpeedBumpActive = activePanelContent === RecurringPanelOptionsEnum.DELETE_SPEED_BUMP;
    const isHistoryList = activePanelContent === RecurringPanelOptionsEnum.HISTORY;
    return (
        <SlideUpPanel
            title={getPanelTitle()}
            closeText={
                activePanelContent === RecurringPanelOptionsEnum.HISTORY && historyModified
                    ? getContent('CLOSE')
                    : getContent('CANCEL')
            }
            confirmText={getConfirmText()}
            disableConfirmButton={!(deleteSpeedBumpActive || enableForwardButton)}
            forwardActionCallback={forwardActionCallback}
            forwardActionButtonColor={deleteSpeedBumpActive ? 'var(--theme-red-dark)' : void 0}
            backwardsActionCallback={getBackwardsActionCallback()}
            tagColor={isHistoryList ? 'var(--theme-celadon-blue-pale)' : void 0}
            onPanelClose={handlePanelClose}
        >
            {renderSlideInPanelContents()}
        </SlideUpPanel>
    );
}
