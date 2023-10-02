import { useState } from 'react';
import dayjs from 'dayjs';
import DateRangeType from '../Constants/DateRangeTypes';

// IIFE for current always current date
const present = (() => dayjs())();

/* This hook keeps date range state for the caller, it returns:
   'dateRange' - {startDate: dayjs, endDate: dayjs,  } (Defaults to the first of the current month and today for the end date)
   updateDateRange(newStartDate: dayjs, newEndDate: dayjs) => void
   dateRangeType - string containing if the current selected date range is a year period, month
   shiftYearInContext - function that moves the current year in context forward or backwards 1 year
   shiftMonthInContext - function that moves the current month in context forward or backwards 1 month
 */
export default function useDateRange(
    initialStartDate = present.startOf('month'),
    initialEndDate = present,
    initialDateRangeType = DateRangeType.MONTH
) {
    // Defaulting the starting date to the start of the current month
    // Defaulting the ending date to today
    const [dateRange, setDateRange] = useState({
        startDate: initialStartDate,
        endDate: initialEndDate
    });

    const [dateRangeType, setDateRangeType] = useState(initialDateRangeType);

    // If a value is not given for the new start or end date then it will default to the current state
    function updateDateRange(newStartDate, newEndDate, newDateRangeType) {
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
    function shiftYearInContext(isForward) {
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
    function shiftMonthInContext(isForward) {
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
}