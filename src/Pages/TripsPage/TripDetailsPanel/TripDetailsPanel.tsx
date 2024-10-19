import DiscretionarySpendForm from 'Components/DiscretionarySpendForm/DiscretionarySpendForm';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import TripExpenseList from 'Components/TripExpenseList/TripExpenseList';
import { useState } from 'react';
import { DiscretionarySpendTransaction } from 'Types/Services/spending.model';
import { Trip } from 'Types/Services/trips.model';

type TripDetailsPanelPropTypes = {
    trip: Trip;
    isOpen: boolean;
    onClose: () => void;
};

export default function TripDetailsPanel({ trip, isOpen, onClose }: TripDetailsPanelPropTypes) {
    const [transactionToEdit, setTransactionToEdit] = useState<DiscretionarySpendTransaction>();

    return (
        <SlideUpPanel
            isOpen={isOpen}
            title={trip.tripName}
            tagColor="var(--token-color-semantic-info)"
            handlePanelWillClose={() => {
                onClose();
                setTransactionToEdit(undefined);
            }}
        >
            {transactionToEdit ? (
                <DiscretionarySpendForm
                    transactionToEdit={transactionToEdit}
                    onCancel={() => setTransactionToEdit(undefined)}
                    onSubmit={() => {
                        /* TODO: */
                    }}
                />
            ) : (
                <TripExpenseList tripId={trip.tripId} setTransactionToEdit={setTransactionToEdit} />
            )}
        </SlideUpPanel>
    );
}
