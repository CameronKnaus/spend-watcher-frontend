import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import type { RecurringSummaryV1Response } from 'Types/Services/spending.model';

export default function useRecurringSummaryService() {
    return useQuery({
        queryKey: ['recurring', 'summary'],
        queryFn: async () => {
            const response = await axios.get(SERVICE_ROUTES.getRecurringSummary);
            // TODO: Need better type handling so type casting isn't required.
            return response.data as RecurringSummaryV1Response;
        },
    });
}
