import { useState } from 'react';
import SlideUpPanel from 'Components/UIElements/Modal/SlideUpPanel/SlideUpPanel';
import TripForm from 'Components/Trips/TripForm/TripForm';
import TripDetails from 'Components/Trips/TripDetails/TripDetails';
import dayjs, { Dayjs } from 'dayjs';
import { Trip } from 'Types/TripTypes';
import { EmptyCallback } from 'Types/QoLTypes';
import useContent from 'CustomHooks/useContent';

const PANEL_ENUM = {
    NEW: 'NEW',
    EDIT: 'EDIT',
    DETAILS: 'DETAILS'
};

type TripsSlideInPanelPropTypes = {
    tripToView?: Trip;
    handlePanelClose: EmptyCallback;
}

export default function TripsSlideInPanel({ tripToView, handlePanelClose }: TripsSlideInPanelPropTypes) {
    const [formValid, setFormValid] = useState(false);
    const [panelState, setPanelState] = useState(tripToView ? PANEL_ENUM.DETAILS : PANEL_ENUM.NEW);
    const [forwardActionCallback, setForwardActionCallback] = useState<EmptyCallback>(() => { /* NOOP */ });
    const getContent = useContent('TRIPS');

    function getDayCountMessage(startDate: Dayjs, endDate: Dayjs) {
        if(!startDate || !endDate) {
            return '';
        }

        const isPast = dayjs().isAfter(endDate);
        const daysDiff = endDate.diff(startDate.format('YYYY-MM-DD'), 'day') + 1;
        let key = isPast ? 'DAY_COUNT_PAST' : 'DAY_COUNT';

        if(daysDiff > 1) {
            key += '_PLURAL';
        }

        // @ts-expect-error
        return getContent(key, [daysDiff]);
    }

    function renderSlideInPanelContents() {
        switch (panelState) {
            case PANEL_ENUM.NEW:
            case PANEL_ENUM.EDIT:
                return (
                    <TripForm existingTrip={tripToView}
                              setForwardActionCallback={setForwardActionCallback}
                              getDayCountMessage={getDayCountMessage}
                              setFormValid={setFormValid}
                    />
                );
            case PANEL_ENUM.DETAILS:
                return (
                    <TripDetails existingTrip={tripToView!}
                                 getDayCountMessage={getDayCountMessage}
                                 editDetailsCallback={() => setPanelState(PANEL_ENUM.EDIT)}
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

        return void 0;
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