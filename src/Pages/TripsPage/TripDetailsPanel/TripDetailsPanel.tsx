import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { Trip } from 'Types/Services/trips.model';
import TripDetails from './TripDetails/TripDetails';

type TripDetailsPanelPropTypes = {
    trip: Trip;
    dateLabel: string;
    isOpen: boolean;
    onClose: () => void;
};

enum TripPanelState {
    base = 'base',
    editTripDetails = 'editTripDetails',
    editTransaction = 'editTransaction',
}

export default function TripDetailsPanel({ trip, isOpen, dateLabel, onClose }: TripDetailsPanelPropTypes) {
    const [panelState, setPanelState] = useState(TripPanelState.base);
    const getContent = useContent('trips');

    function getPanelTitle() {
        if (panelState === TripPanelState.editTripDetails) {
            return getContent('editTripDetails');
        }

        if (panelState === TripPanelState.editTransaction) {
            return getContent('editTransaction');
        }

        return trip.tripName;
    }

    function getTagColor() {
        if (panelState === TripPanelState.editTripDetails) {
            return 'var(--token-color-semantic-info)';
        }

        if (panelState === TripPanelState.editTransaction) {
            return 'var(--token-color-semantic-expense)';
        }

        return 'var(--token-color-semantic-info)';
    }

    return (
        <SlideUpPanel
            isOpen={isOpen}
            title={getPanelTitle()}
            tagColor={getTagColor()}
            handlePanelWillClose={() => {
                setPanelState(TripPanelState.base);
                onClose();
            }}
        >
            {panelState === TripPanelState.base && (
                <>
                    <TripDetails
                        trip={trip}
                        dateLabel={dateLabel}
                        onEditButtonClick={() => setPanelState(TripPanelState.editTripDetails)}
                        onEditComplete={() => setPanelState(TripPanelState.base)}
                        onClose={onClose}
                    />
                </>
            )}
        </SlideUpPanel>
    );
}
