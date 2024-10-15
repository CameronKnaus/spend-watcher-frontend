import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { TripsListV1Response } from 'Types/Services/trips.model';

export default function useTripsList() {
    return useQuery<TripsListV1Response>({
        queryKey: ['trips'],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getTripsList);

            return response.data;
        },
    });
}
