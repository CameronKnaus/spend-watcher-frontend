import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import DateRangeType, { DateRange } from '../Constants/DateRangeTypes';

// IIFE for current always current date
const present = (() => dayjs())();

type DateRangeReturnType = {
    dateRange: DateRange,
    updateDateRange: (newStartDate?: dayjs.Dayjs, newEndDate?: dayjs.Dayjs, newDateRangeType?: DateRangeType) => void,
    dateRangeType: DateRangeType,
    shiftYearInContext: (isForward?: boolean) => void,
    shiftMonthInContext: (isForward?: boolean) => void
}

// This hook keeps date range state for the caller
export default function useDateRange(
    initialStartDate = present.startOf('month'),
    initialEndDate = present,
    initialDateRangeType = DateRangeType.MONTH
): DateRangeReturnType {
    // Defaulting the starting date to the start of the current month
    // Defaulting the ending date to today
    const [dateRange, setDateRange] = useState({
        startDate: initialStartDate,
        endDate: initialEndDate
    });

    const [dateRangeType, setDateRangeType] = useState(initialDateRangeType);

    return useMemo(() => {
        // If a value is not given for the new start or end date then it will default to the current state
        function updateDateRange(newStartDate?: dayjs.Dayjs, newEndDate?: dayjs.Dayjs, newDateRangeType?: DateRangeType) {
            if(newDateRangeType) {
                setDateRangeType(newDateRangeType);
            }

            // Set to new or use current if undefined
            setDateRange({
                startDate: newStartDate || dateRange.startDate,
                endDate: newEndDate || dateRange.endDate
            });
        }


        // increase or decrease the current year in context by 1 year
        function shiftYearInContext(isForward = false) {
            const presentDate = dayjs();
            // Disallow shifting forward 1 year ahead of present
            if(isForward && dateRange.endDate.year() === presentDate.year()) {
                return;
            }

            const shiftAmount = isForward ? 1 : -1;
            const newYear = dateRange.endDate.add(shiftAmount, 'year');
            const isCurrentYear = presentDate.year() === newYear.year();
            setDateRange({
                startDate: dateRange.startDate.add(shiftAmount, 'year'),
                endDate: isCurrentYear ? presentDate : newYear.endOf('year')
            });
        }

        // increase or decrease the current month in context by 1 month
        function shiftMonthInContext(isForward = false) {
            const presentDate = dayjs();
            // Disallow shifting forward 1 month ahead of present
            const isCurrentYear = dateRange.endDate.year() === presentDate.year();
            const isSameMonth = dateRange.endDate.month() === presentDate.month();
            if(isForward && isCurrentYear && isSameMonth) {
                return;
            }

            const shiftAmount = isForward ? 1 : -1;
            const newEndDate = dateRange.endDate.add(shiftAmount, 'month');
            const isSameMonthAndYear = presentDate.month() === dateRange.endDate.month()
            && presentDate.year() === dateRange.endDate.year();

            setDateRange({
                startDate: dateRange.startDate.add(shiftAmount, 'month').startOf('month'),
                endDate: isSameMonthAndYear ? newEndDate.endOf('month') : newEndDate
            });
        }


        return {
            dateRange,
            updateDateRange,
            dateRangeType,
            shiftYearInContext,
            shiftMonthInContext
        };
    }, [dateRange, dateRangeType]);
}