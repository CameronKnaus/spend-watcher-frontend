import { ReactElement, createContext, useMemo } from 'react';
import useFetch from 'CustomHooks/useFetch';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { FaPlaneDeparture } from 'react-icons/fa';
import AuthHandler from 'Util/Authentication/AuthHandler';
import { Trip } from 'Types/TripTypes';
import { FilterableSelectOption } from 'Components/UIElements/Form/FilterableSelect/FilterableSelect';

// TODO: Replace with useQuery.  Typescript can be cleaned up when this is done.
export interface TripContextType {
    activeTrip: any,
    tripsList: Array<Trip>,
    filterableSelectTripsList: Array<FilterableSelectOption>,
    refreshTrips: (fireSilently?: boolean) => void,
    tripDetailsError: Error | null,
    tripDetailsLoading: boolean
}

export const tripsContext = createContext({} as TripContextType);

export function TripsContextProvider({ children }: {children: ReactElement}) {
    const { response, fire, loading, error } = useFetch(SERVICE_ROUTES.getAllTripDetails, AuthHandler.isAuthenticated());

    const contextValue = useMemo<TripContextType>(() => {
        const tripsList =  response?.tripsList ?? [];
        let activeTrip: any = null;
        const filterableSelectTripsList = tripsList.map((trip: any) => {
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