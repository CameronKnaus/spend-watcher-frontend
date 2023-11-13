import { ReactElement, createContext, useMemo } from 'react';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { FaPlaneDeparture } from 'react-icons/fa';
import { Trip } from 'Types/TripTypes';
import { FilterableSelectOption } from 'Components/UIElements/Form/FilterableSelect/FilterableSelect';
import { useQuery } from '@tanstack/react-query';
import { tripManagerQueryKey } from 'Util/QueryKeys';
import msMapper from 'Util/Time/TimeMapping';
import axios from 'axios';
import { Color } from 'Types/StyleTypes';
import { IconComponentType } from 'Types/QoLTypes';

// TODO: Replace with useQuery.  Typescript can be cleaned up when this is done.
export interface TripContextType {
    activeTrip?: Trip,
    tripsList: Array<Trip>,
    filterableSelectTripsList: Array<FilterableSelectOption>,
    tripDetailsError: unknown,
    tripDetailsLoading: boolean
}

export const tripsContext = createContext({} as TripContextType);

export function TripsContextProvider({ children }: {children: ReactElement}) {
    const { isLoading, data: response, error: tripDetailsError } = useQuery({
        queryKey: [
            tripManagerQueryKey
        ],
        staleTime: msMapper.day,
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.getAllTripDetails);
        },
        select: ({ data }: { data: { tripsList: Array<Trip> }}) => data
    });

    const contextValue = useMemo<TripContextType>(() => {
        const tripsList =  response?.tripsList ?? [];
        let activeTrip: Trip | undefined;
        const filterableSelectTripsList = tripsList.map((trip: Trip) => {
            if(!activeTrip && trip.tripIsActive) {
                activeTrip = trip;
            }

            return {
                value: trip.tripId,
                icon: <FaPlaneDeparture /> as IconComponentType,
                iconBackgroundColor: 'var(--theme-jungle-green-pale)' as Color,
                optionName: trip.tripName
            };
        });

        return {
            activeTrip,
            tripsList,
            filterableSelectTripsList,
            tripDetailsError,
            tripDetailsLoading: isLoading
        };
    }, [isLoading, response?.tripsList, tripDetailsError]);

    return (
        <tripsContext.Provider value={contextValue}>
            {children}
        </tripsContext.Provider>
    );
}