import dayjs from 'dayjs';

enum DateRangeType {
    MONTH = 'MONTH',
    YEAR = 'YEAR',
    MAX = 'MAX',
    SPECIFIC = 'SPECIFIC'
}

export type DateRange = {
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
    }

export default DateRangeType;