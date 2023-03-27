import { tripsContext } from 'Contexts/trips/TripsContext';
import { useContext } from 'react';

export default function useTripDetails() {
    return useContext(tripsContext);
}