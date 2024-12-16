import useSelectedTimeFrame from 'Hooks/useSelectedTimeFrame/useSelectedTimeFrame';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './TimeFrameButton.module.css';

export default function TimeFrameButton() {
    const {
        forwardOneMonth,
        backOneMonth,
        forwardOneYear,
        backOneYear,
        dateRangeType,
        currentMonthLabel,
        currentYearLabel,
    } = useSelectedTimeFrame();

    function backClick() {
        if (dateRangeType === 'MONTH') {
            backOneMonth();
        } else {
            backOneYear();
        }
    }

    function forwardClick() {
        if (dateRangeType === 'MONTH') {
            forwardOneMonth();
        } else {
            forwardOneYear();
        }
    }

    return (
        <div className={styles.container}>
            <button className={styles.arrowButton} onClick={backClick}>
                <FaArrowLeft />
            </button>
            <button className={styles.timeFrameButton}>
                {dateRangeType === 'MONTH' && (
                    <>
                        <div>{currentMonthLabel}</div>
                        <div className={styles.yearLabel}>{currentYearLabel}</div>
                    </>
                )}
                {dateRangeType === 'YEAR' && <div>{currentYearLabel}</div>}
            </button>
            <button className={styles.arrowButton} onClick={forwardClick}>
                <FaArrowRight />
            </button>
        </div>
    );
}
