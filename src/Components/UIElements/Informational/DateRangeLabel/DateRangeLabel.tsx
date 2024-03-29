import styles from './DateRangeLabel.module.css';
import useContent from 'CustomHooks/useContent';
import DateRangeType from 'Constants/DateRangeTypes';
import msMapper from 'Util/Time/TimeMapping';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useIsMobile } from 'Util/IsMobileContext';
import dayjs from 'dayjs';
import { DateType } from 'Types/DateTypes';

type DateRangeLabelPropTypes = {
    dateRangeType: DateRangeType;
    startDate: DateType;
    endDate: DateType;
}

export default function DateRangeLabel({ dateRangeType, startDate, endDate }: DateRangeLabelPropTypes) {
    const isMobile = useIsMobile();
    const [backgroundVisible, setBackgroundVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(!containerRef.current || !isMobile) {
            setBackgroundVisible(false);
            return () => { /* NOOP */ };
        }

        function handleVerticalScroll() {
            if(!containerRef.current) {
                return;
            }

            setBackgroundVisible(containerRef.current.getBoundingClientRect().top < 37);
        }

        window.addEventListener('scroll', handleVerticalScroll);

        return () => {
            window.removeEventListener('scroll', handleVerticalScroll);
        };
    }, [isMobile]);


    const getContent = useContent('SPENDING_BREAKDOWN');
    const dateLabelString = getContent('DATE_RANGE_LABEL', [startDate, endDate]);

    let totalTimeBetweenDates = dayjs(endDate).diff(startDate);
    // Years
    const numberOfYears = Math.round(totalTimeBetweenDates / msMapper.year);
    totalTimeBetweenDates = totalTimeBetweenDates % msMapper.year;

    // Months
    const numberOfMonths = Math.round(totalTimeBetweenDates / msMapper.month);
    totalTimeBetweenDates = totalTimeBetweenDates % msMapper.month;

    // Days
    const numberOfDays = Math.round(totalTimeBetweenDates / msMapper.day);
    totalTimeBetweenDates = totalTimeBetweenDates % msMapper.day;

    return (
        <div ref={containerRef}
             className={clsx({
                [styles.stickyContainer]: true,
                [styles.transparentBackground]: backgroundVisible
            })}
        >
            <div className={styles.dateRangeLabel}>
                {dateLabelString}
            </div>
            {
                dateRangeType === DateRangeType.MAX && (
                <div className={styles.timeTotals}>
                    {
                        numberOfYears ? (
                            <div className={styles.dateRangeSubLabel}>
                                {getContent('YEAR_COUNT', [numberOfYears, numberOfMonths, numberOfDays])}
                            </div>
                        ) : numberOfMonths ? (
                            <div className={styles.dateRangeSubLabel}>
                                {getContent('MONTH_COUNT', [numberOfMonths, numberOfDays])}
                            </div>
                        ) : (
                            <div className={styles.dateRangeSubLabel}>
                                {getContent('DAY_COUNT', [numberOfDays])}
                            </div>
                        )
                    }
                </div>
                )
            }
        </div>
    );
}