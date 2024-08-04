import { useQuery } from '@tanstack/react-query';
import { FilterableSelectOption } from 'Components/UIElements/Form/FilterableSelect/FilterableSelect';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { Color } from 'Types/StyleTypes';
import { Trip } from 'Types/TripTypes';
import { tripManagerQueryKey } from 'Util/QueryKeys';
import axios from 'axios';
import { FaPlaneDeparture } from 'react-icons/fa';
import { IconComponentType } from 'Types/QoLTypes';

export interface UseTripsListReturn {
    activeTrip?: Trip,
    tripsList: Array<Trip>,
    filterableSelectTripsList: Array<FilterableSelectOption>,
    tripDetailsError: unknown,
    tripDetailsLoading: boolean
}

export default function useTripList(): UseTripsListReturn {
    const { isLoading, data: response, error: tripDetailsError } = useQuery({
        queryKey: [
            tripManagerQueryKey
        ],
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.getAllTripDetails);
        },
        select: ({ data }: { data: { tripsList: Array<Trip> }}) => data
    });

    const tripsList =  response?.tripsList ?? [];

    // Creating a list for use in select inputs for filtering
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
}