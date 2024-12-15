import { addMonths, format, startOfMonth, subMonths } from 'date-fns';
import { createContext, useState } from 'react';
import { DbDate, dbDateFormat } from 'Types/dateTypes';
import { parseDbDate } from 'Util/Formatters/dateFormatters/dateFormatters';

export type SelectedTimeFrameContextAPI = {
    startDate: DbDate;
    endDate: DbDate;
    setStartDate: (date: DbDate) => void;
    setEndDate: (date: DbDate) => void;
    forwardOneMonth: () => void;
    backOneMonth: () => void;
};

export const SelectedTimeFrameContext = createContext<SelectedTimeFrameContextAPI | null>(null);

export default function SelectedTimeFrameProvider({ children }: { children: React.ReactNode }) {
    // Default start date to first day of this month
    const [startDate, setStartDate] = useState<DbDate>(format(startOfMonth(new Date()), dbDateFormat));
    // Default end date to today
    const [endDate, setEndDate] = useState<DbDate>(format(new Date(), dbDateFormat));

    const selectedTimeFrameAPI = {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        forwardOneMonth: () => {
            const newStartDate = addMonths(parseDbDate(startDate), 1);
            const newEndDate = addMonths(parseDbDate(endDate), 1);

            setStartDate(format(newStartDate, dbDateFormat));
            setEndDate(format(newEndDate, dbDateFormat));
        },
        backOneMonth: () => {
            const newStartDate = subMonths(parseDbDate(startDate), 1);
            const newEndDate = subMonths(parseDbDate(endDate), 1);

            setStartDate(format(newStartDate, dbDateFormat));
            setEndDate(format(newEndDate, dbDateFormat));
        },
    };

    return (
        <SelectedTimeFrameContext.Provider value={selectedTimeFrameAPI}>{children}</SelectedTimeFrameContext.Provider>
    );
}
