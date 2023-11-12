import { DateType } from './DateTypes';

export type Trip = {
    startDate: DateType;
    endDate: DateType;
    tripId: string;
    tripTotal: number;
    tripName: string;
}