import styles from './DateContextShifter.module.css';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import clsx from 'clsx';
import useContent from 'CustomHooks/useContent';
import DateRangeType from 'Constants/DateRangeTypes';
import dayjs, { Dayjs } from 'dayjs';

const { MONTH, YEAR } = DateRangeType;

type DateContextShifterPropTypes = {
    dateRangeType: DateRangeType;
    startDate: Dayjs;
    endDate: Dayjs;
    shiftMonthInContext: (isForward: boolean) => void;
    shiftYearInContext: (isForward: boolean) => void;
    minAllowedDate: Dayjs;
}

export default function DateContextShifter({ dateRangeType, startDate, endDate, shiftMonthInContext, shiftYearInContext, minAllowedDate }: DateContextShifterPropTypes) {
    const getContent = useContent('DATE_CONTEXT_SHIFTER');

    function shouldNextBeDisabled() {
        const present = dayjs();
        const isPresentYear = present.year() === endDate.year();
        if(dateRangeType === YEAR) {
            // Disable if end date is the current year
            return isPresentYear;
        }

        if(dateRangeType === MONTH) {
            // Disable if the end date is the current month
            return isPresentYear && endDate.month() === present.month();
        }

        return true;
    }

    function shouldLastBeDisabled() {
        const minDate = dayjs(minAllowedDate);

        const isMinYear = minDate.year() === startDate.year();
        if(dateRangeType === YEAR) {
            return isMinYear;
        }

        if(dateRangeType === MONTH) {
            return isMinYear && minDate.month() === startDate.month();
        }

        return true;
    }

    function handleShift(isDisabled: boolean, isForward: boolean) {
        if(isDisabled) {
            return;
        }

        if(dateRangeType === YEAR) {
            shiftYearInContext(isForward);
            return;
        }

        if(dateRangeType === MONTH) {
            shiftMonthInContext(isForward);
        }
    }

    const isYear = dateRangeType === YEAR;
    const nextText = getContent(isYear ? 'NEXT_YEAR' : 'NEXT_MONTH');
    const lastText = getContent(isYear ? 'LAST_YEAR' : 'LAST_MONTH');
    const disableLast = shouldLastBeDisabled();
    const disableNext = shouldNextBeDisabled();
    return (
        <div className={styles.buttonContainer}>
            <button className={clsx(styles.button, styles.buttonLeft, disableLast && styles.inactive)}
                    onClick={() => { handleShift(disableLast, false) }}
            >
                <CgChevronLeft />
                {lastText}
            </button>
            <button className={clsx(styles.button, styles.buttonRight, disableNext && styles.inactive)}
                    onClick={() => { handleShift(disableNext, true) }}
            >
                {nextText}
                <CgChevronRight />
            </button>
        </div>
    );
}