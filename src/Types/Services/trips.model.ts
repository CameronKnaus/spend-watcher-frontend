import { DbDate } from 'Types/dateTypes';
import * as zod from 'zod';
import { DiscretionarySpendTransaction } from './spending.model';

export type Trip = {
    tripId: string; // uuid
    tripName: string;
    startDate: DbDate;
    endDate: DbDate;
};

// TRIPS LIST API --- /api/trips/v1/list

export type TripsListV1Response = {
    tripsList: (Trip & {
        totalSpent: number;
    })[];
};

// END TRIPS LIST API

// TRIP EXPENSES API --- /api/trips/v1/expenses

export const v1TripExpensesSchema = zod.object({
    tripId: zod.string().uuid(),
});

export type TripExpensesRequestParams = zod.infer<typeof v1TripExpensesSchema>;

export type TripLinkedExpensesV1Response = {
    expenseList: DiscretionarySpendTransaction[];
};

// END TRIP EXPENSES API
