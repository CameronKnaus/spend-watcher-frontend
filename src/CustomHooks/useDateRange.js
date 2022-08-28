import { useState } from 'react';
import dayjs from 'dayjs';

// IIFE for current always current date
const present = (() => dayjs())();

/* This hook keeps date range state for the caller, it returns:
   'dateRange' - {startDate: dayjs, endDate: dayjs } (Defaults to the first of the current month and today for the end date)
   updateDateRange(newStartDate: dayjs, newEndDate: dayjs) => void
 */
export default function useDateRange(initialStartDate = present.startOf('month'), initialEndDate = present) {
    // Defaulting the starting date to the start of the current month
    // Defaulting the ending date to today
    const [dateRange, setDateRange] = useState({
        startDate: initialStartDate,
        endDate: initialEndDate
    });

    // If a value is not given for the new start or end date then it will default to the current state
    function updateDateRange(newStartDate = dateRange.startDate, newEndDate = dateRange.endDate) {
        setDateRange({
            startDate: newStartDate,
            endDate: newEndDate
        });
    }

    return {
        dateRange,
        updateDateRange
    };
}