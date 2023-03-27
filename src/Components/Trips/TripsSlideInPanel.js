import { useState } from 'react';
import useContent from 'CustomHooks/useContent';
import SlideUpPanel from 'Components/UIElements/Modal/SlideUpPanel';
import TripForm from 'Components/Trips/TripForm';
import TripDetails from 'Components/Trips/TripDetails';
import dayjs from 'dayjs';

const PANEL_ENUM = {
    NEW: 'NEW',
    EDIT: 'EDIT',
    DETAILS: 'DETAILS'
};

export default function TripsSlideInPanel({ tripToView, handlePanelClose, refreshRequested, callForRefresh }) {
    const [formValid, setFormValid] = useState(false);
    const [panelState, setPanelState] = useState(tripToView ? PANEL_ENUM.DETAILS : PANEL_ENUM.NEW);
    const [forwardActionCallback, setForwardActionCallback] = useState(() => { /* NOOP */ });
    const getContent = useContent('TRIPS');

    function getDayCountMessage(startDate, endDate) {
        if(!startDate || !endDate) {
            return '';
        }

        const isPast = dayjs().isAfter(endDate);
        const daysDiff = endDate.diff(startDate.format('YYYY-MM-DD'), 'day') + 1;
        let key = isPast ? 'DAY_COUNT_PAST' : 'DAY_COUNT';

        if(daysDiff > 1) {
            key += '_PLURAL';
        }

        return getContent(key, [daysDiff]);
    }

    function renderSlideInPanelContents() {
        switch (panelState) {
            case PANEL_ENUM.NEW:
            case PANEL_ENUM.EDIT:
                return (
                    <TripForm existingTrip={tripToView}
                              editMode={panelState === PANEL_ENUM.EDIT}
                              setForwardActionCallback={setForwardActionCallback}
                              getDayCountMessage={getDayCountMessage}
                              setFormValid={setFormValid}
                              onSubmission={callForRefresh}
                    />
                );
            case PANEL_ENUM.DETAILS:
                return (
                    <TripDetails existingTrip={tripToView}
                                 getDayCountMessage={getDayCountMessage}
                                 editDetailsCallback={() => setPanelState(PANEL_ENUM.EDIT)}
                                 refreshRequested={refreshRequested}
                                 callForRefresh={callForRefresh}
                    />
                );
            default:
                return null;
        }
    }

    function getPanelTitle() {
        switch (panelState) {
            case PANEL_ENUM.NEW:
                return getContent('NEW_TRIP');
            case PANEL_ENUM.EDIT:
                return getContent('EDIT_TRIP');
            case PANEL_ENUM.DETAILS: {
                const key = tripToView?.tripName;
                return key ? getContent('TRIP_DETAILS', [key]) : '';
            }
            default:
                return '';
        }
    }

    function getConfirmText() {
        switch (panelState) {
            case PANEL_ENUM.NEW:
            case PANEL_ENUM.EDIT:
                return getContent('SUBMIT');
            default:
                return '';
        }
    }

    function getBackwardsActionCallback() {
        if(panelState === PANEL_ENUM.EDIT) {
            return () => setPanelState(PANEL_ENUM.DETAILS);
        }

        return null;
    }

    return (
        <SlideUpPanel title={getPanelTitle()}
                      closeText={getContent(panelState === PANEL_ENUM.EDIT ? 'CANCEL' : 'CLOSE')}
                      confirmText={getConfirmText()}
                      disableConfirmButton={!formValid}
                      forwardActionCallback={forwardActionCallback}
                      backwardsActionCallback={getBackwardsActionCallback()}
                      tagColor='var(--theme-jungle-green-pale)'
                      onPanelClose={handlePanelClose}
        >
            {renderSlideInPanelContents()}
        </SlideUpPanel>
    );
}