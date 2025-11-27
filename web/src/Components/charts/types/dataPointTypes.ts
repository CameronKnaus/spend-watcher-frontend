import type { DbDate } from 'Types/dateTypes';

export interface DataPoint {
    date: DbDate;
    amount: number;
}
