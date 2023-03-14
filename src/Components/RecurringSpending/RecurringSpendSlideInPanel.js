import { useEffect, useState } from 'react';
import useContent from 'CustomHooks/useContent';
import SlideUpPanel from 'Components/UIElements/Modal/SlideUpPanel';
import RecurringSpendTransactionHistory from 'Components/RecurringSpending/RecurringSpendTransactionHistory/RecurringSpendTransactionHistory';
import RecurringSpendForm from './RecurringSpendForm';
import styles from 'Styles/Components/RecurringSpending/RecurringSpendSlideInPanel.module.css';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import axios from 'axios';

const PANEL_OPTIONS_ENUM = {
    RECURRING: 'RECURRING',
    DELETE_SPEED_BUMP: 'DELETE_SPEED_BUMP',
    HISTORY: 'HISTORY'
};

export default function RecurringSpendSlideInPanel({ onPanelClose, onSubmission, editMode, existingTransaction = {} }) {
    const getContent = useContent('RECURRING_SPENDING');
    const [activePanelContent, setActivePanelContent] = useState(PANEL_OPTIONS_ENUM.RECURRING);
    const [enableForwardButton, setEnableForwardButton] = useState(true);
    const [forwardActionCallback, setForwardActionCallback] = useState(() => { /* NOOP */ });
    const [historyModified, setHistoryModified] = useState(false);

    useEffect(() => {
        if(activePanelContent === PANEL_OPTIONS_ENUM.DELETE_SPEED_BUMP) {
            setForwardActionCallback(() => {
                return () => {
                    // Handle service call
                    axios.post(SERVICE_ROUTES.deleteRecurringExpense, {
                        recurringSpendId: existingTransaction.recurringSpendId
                    }).then(onSubmission);
                };
            });
        }
    }, [activePanelContent, existingTransaction.recurringSpendId, onSubmission]);

    function renderSlideInPanelContents() {
        switch (activePanelContent) {
            case PANEL_OPTIONS_ENUM.RECURRING:
                return (
                    <RecurringSpendForm formIsValidCallback={setEnableForwardButton}
                                        editMode={editMode}
                                        existingTransaction={existingTransaction}
                                        setDeleteSpeedBumpActive={() => setActivePanelContent(PANEL_OPTIONS_ENUM.DELETE_SPEED_BUMP)}
                                        setForwardActionCallback={setForwardActionCallback}
                                        viewHistoryTab={() => setActivePanelContent(PANEL_OPTIONS_ENUM.HISTORY)}
                                        onSubmission={onSubmission}
                    />
                );
            case PANEL_OPTIONS_ENUM.HISTORY:
                return (
                    <RecurringSpendTransactionHistory recurringExpense={existingTransaction} setHistoryModified={setHistoryModified} />
                );
            case PANEL_OPTIONS_ENUM.DELETE_SPEED_BUMP:
                return (
                    <div>
                        <h3 className={styles.speedBumpHeader}>
                            {getContent('SPEED_BUMP')}
                        </h3>
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
            case PANEL_OPTIONS_ENUM.RECURRING:
                return getContent(editMode ? 'EDIT_EXPENSE' : 'NEW_EXPENSE');
            case PANEL_OPTIONS_ENUM.DELETE_SPEED_BUMP:
                return getContent('DELETE_EXPENSE');
            case PANEL_OPTIONS_ENUM.HISTORY:
                return getContent('HISTORY_LABEL', [existingTransaction.expenseName]);
            default:
                return '';
        }
    }

    function getConfirmText() {
        switch (activePanelContent) {
            case PANEL_OPTIONS_ENUM.RECURRING:
                return getContent(editMode ? 'EDIT' : 'SUBMIT');
            case PANEL_OPTIONS_ENUM.DELETE_SPEED_BUMP:
                return getContent('DELETE');
            default:
                return '';
        }
    }

    function handlePanelClose() {
        setHistoryModified(historyModified);
        onPanelClose(historyModified);
    }


    function getBackwardsActionCallback() {
        const { RECURRING } = PANEL_OPTIONS_ENUM;
        if(activePanelContent !== RECURRING && !historyModified) {
            return () => setActivePanelContent(RECURRING);
        }

        return null;
    }

    const deleteSpeedBumpActive = activePanelContent === PANEL_OPTIONS_ENUM.DELETE_SPEED_BUMP;
    const isHistoryList = activePanelContent === PANEL_OPTIONS_ENUM.HISTORY;
    return (
        <SlideUpPanel title={getPanelTitle()}
                      closeText={activePanelContent === PANEL_OPTIONS_ENUM.HISTORY && historyModified ? getContent('CLOSE') : getContent('CANCEL')}
                      confirmText={getConfirmText()}
                      disableConfirmButton={!(deleteSpeedBumpActive || enableForwardButton)}
                      forwardActionCallback={forwardActionCallback}
                      forwardActionButtonColor={deleteSpeedBumpActive ? 'var(--theme-red-dark)' : null}
                      backwardsActionCallback={getBackwardsActionCallback()}
                      tagColor={isHistoryList ? 'var(--theme-celadon-blue-pale)' : void 0}
                      onPanelClose={handlePanelClose}
        >
            {renderSlideInPanelContents()}
        </SlideUpPanel>
    );
}