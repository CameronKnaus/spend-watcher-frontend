import { createContext, useMemo } from 'react';
import useFetch from 'CustomHooks/useFetch';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { FaPlaneDeparture } from 'react-icons/fa';
import AuthHandler from 'Util/Authentication/AuthHandler';

export const tripsContext = createContext({});

export function TripsContextProvider({ children }) {
    const { response, fire, loading, error } = useFetch(SERVICE_ROUTES.getAllTripDetails, AuthHandler.isAuthenticated());

    const contextValue = useMemo(() => {
        const tripsList =  response?.tripsList ?? [];
        let activeTrip = null;
        const filterableSelectTripsList = tripsList.map(trip => {
            if(!activeTrip && trip.tripIsActive) {
                activeTrip = trip;
            }

            return {
                value: trip.tripId,
                icon: <FaPlaneDeparture />,
                iconBackgroundColor: 'var(--theme-jungle-green-pale)',
                optionName: trip.tripName
            };
        });

        return {
            activeTrip,
            tripsList,
            filterableSelectTripsList,
            refreshTrips: fire ?? (() => { /* NOOP */ }),
            tripDetailsError: error,
            tripDetailsLoading: Boolean(loading)
        };
    }, [error, fire, loading, response?.tripsList]);

    return (
        <tripsContext.Provider value={contextValue}>
            {children}
        </tripsContext.Provider>
    );
}