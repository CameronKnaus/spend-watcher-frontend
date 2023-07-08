import styles from './DateContextShifter.module.css';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import clsx from 'clsx';
import useContent from 'CustomHooks/useContent';
import DATE_RANGE_TYPES from 'Constants/DateRangeTypes';
import dayjs from 'dayjs';

const { MONTH, YEAR } = DATE_RANGE_TYPES;

export default function DateContextShifter({ dateRangeType, startDate, endDate, shiftMonthInContext, shiftYearInContext, minAllowedDate }) {
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
        const minDateJS = dayjs(minAllowedDate);

        const isMinYear = minDateJS.year() === startDate.year();
        if(dateRangeType === YEAR) {
            return isMinYear;
        }

        if(dateRangeType === MONTH) {
            return isMinYear && minDateJS.add(1, 'month').month() === startDate.month();
        }

        return true;
    }

    function handleShift(isDisabled, isForward) {
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