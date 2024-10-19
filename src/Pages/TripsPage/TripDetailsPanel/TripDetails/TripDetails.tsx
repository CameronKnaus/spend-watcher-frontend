import { useQueryClient } from '@tanstack/react-query';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import DiscretionarySpendForm from 'Components/DiscretionarySpendForm/DiscretionarySpendForm';
import TripExpenseList from 'Components/TripExpenseList/TripExpenseList';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { DiscretionarySpendTransaction } from 'Types/Services/spending.model';
import { Trip } from 'Types/Services/trips.model';
import styles from './TripDetails.module.css';

type TripDetailsPropTypes = {
    trip: Trip;
    dateLabel: string;
    onEditButtonClick: () => void;
    onEditComplete: () => void;
    onClose: () => void;
};

export default function TripDetails({
    trip,
    dateLabel,
    onEditButtonClick,
    onEditComplete,
    onClose,
}: TripDetailsPropTypes) {
    const queryClient = useQueryClient();
    const [transactionToEdit, setTransactionToEdit] = useState<DiscretionarySpendTransaction>();
    const getContent = useContent('trips');

    if (transactionToEdit) {
        return (
            <DiscretionarySpendForm
                transactionToEdit={transactionToEdit}
                onCancel={() => {
                    setTransactionToEdit(undefined);
                    onEditComplete();
                }}
                onSubmit={() => {
                    queryClient.invalidateQueries({
                        queryKey: ['spending'],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ['trips', 'linkedExpenses', trip.tripId],
                    });
                    onEditComplete();
                    setTransactionToEdit(undefined);
                }}
            />
        );
    }

    return (
        <>
            <div className={styles.dateLabel}>{dateLabel}</div>
            <TripExpenseList tripId={trip.tripId} setTransactionToEdit={setTransactionToEdit} />
            {!transactionToEdit && (
                <BottomSheet>
                    <CustomButton layout="full-width" variant="secondary" onClick={onClose}>
                        {getContent('close')}
                    </CustomButton>
                    <CustomButton layout="full-width" variant="primary" onClick={onEditButtonClick}>
                        {getContent('editTripDetails')}
                    </CustomButton>
                </BottomSheet>
            )}
        </>
    );
}
