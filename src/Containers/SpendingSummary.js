import useContent from '../CustomHooks/useContent';
import NavigationalBanner from '../Components/UIElements/Navigation/NavigationalBanner';
import { useState } from 'react';
import dayjs from 'dayjs';
import DateChangerTile from '../Components/UIElements/Form/DateChangerTile';
import styles from '../Styles/Containers/SpendingSummary.module.css';

export default function SpendingSummary() {
    const TODAY = dayjs();
    const [startDate, setStartDate] = useState(TODAY);
    const [endDate, setEndDate] = useState(TODAY);

    const getContent = useContent();
    const text = (key, args) => getContent('SPENDING_SUMMARY', key, args);

    return (
        <>
            <NavigationalBanner title={text('TITLE')} />
            <div className={`${styles.gutter} ${styles.dateContextContainer}`}>
                <DateChangerTile resultsText={text('RESULTS')}
                                 setStartDate={setStartDate}
                                 setEndDate={setEndDate}
                                 endDate={endDate}
                                 startDate={startDate}
                />
            </div>
        </>
    );
}