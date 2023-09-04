import { TripContextType, tripsContext } from 'Contexts/trips/TripsContext';
import { useContext } from 'react';

export default function useTripDetails(): TripContextType {
    return useContext(tripsContext);
}