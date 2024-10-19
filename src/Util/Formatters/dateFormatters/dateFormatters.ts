import { format, parse } from 'date-fns';
import { DbDate, dbDateFormat } from 'Types/dateTypes';

export function formatToMonthDayYear(date: DbDate): string {
    return format(parse(date, dbDateFormat, new Date()), 'MMM do, yyyy');
}

export function formatToMonthDay(date: DbDate): string {
    return format(parse(date, dbDateFormat, new Date()), 'MMM do');
}
