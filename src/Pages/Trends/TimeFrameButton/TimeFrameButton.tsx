import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { getCurrentMonthLabel } from 'Util/Formatters/dateFormatters/dateFormatters';
import styles from './TimeFrameButton.module.css';

export default function TimeFrameButton() {
    const label = getCurrentMonthLabel();
    return (
        <div className={styles.container}>
            <button className={styles.arrowButton}>
                <FaArrowLeft />
            </button>
            <button className={styles.timeFrameButton}>{label}</button>
            <button className={styles.arrowButton}>
                <FaArrowRight />
            </button>
        </div>
    );
}
