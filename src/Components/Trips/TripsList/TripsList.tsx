import useContent from 'CustomHooks/useContent';
import styles from './TripsList.module.css';
import dayjs from 'dayjs';
import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';
import { Dispatch, SetStateAction } from 'react';
import { Trip } from 'Types/TripTypes';

type TripsListPropTypes = {
    tripsList: Array<Trip>;
    isLoading: boolean;
    setExistingTripToView: Dispatch<SetStateAction<number | null>>;
}

export default function TripsList({ tripsList, isLoading, setExistingTripToView }: TripsListPropTypes) {
    const getContent = useContent('TRIPS');

    if(isLoading) {
        return <LoadingInteractiveRowList id='loading-transaction' rowCount={3} rowSpacing={12} />;
    }

    if(!tripsList.length) {
        return (
            <div className={styles.issueMessage}>
                {getContent('NO_TRIPS')}
            </div>
        );
    }

    return (
        tripsList.map((trip, index) => (
            <div key={trip.tripId}
                 className={styles.transactionWrapper}
            >
                <InteractiveDataRow isExpense
                                    title={trip.tripName}
                                    iconCategory='TRIP'
                                    description={`${dayjs(trip.startDate).format('MM/DD/YYYY')} - ${dayjs(trip.endDate).format('MM/DD/YYYY')}`}
                                    amountDescription={getContent('TRIP_TOTAL')}
                                    amount={trip.tripTotal}
                                    onClick={() => setExistingTripToView(index)}
                />
            </div>
        ))
    );
}