import { useEffect, useState } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from 'Styles/Components/Trips/TripForm.module.css';
import Link from 'Components/UIElements/Navigation/Link';
import { IoTrashSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import { DatePicker } from '@material-ui/pickers';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';

export default function TripForm({ existingTrip, onSubmission, setForwardActionCallback, getDayCountMessage, setFormValid }) {
    const text = useContent('TRIPS');

    // State for form values
    const [tripName, setTripName] = useState(existingTrip?.tripName ?? '');
    const [startDate, setStartDate] = useState(existingTrip?.startDate ? dayjs(existingTrip?.startDate) : dayjs());
    const [endDate, setEndDate] = useState(existingTrip?.endDate ? dayjs(existingTrip?.endDate) : dayjs());
    const hasExistingTrip = Boolean(existingTrip);

    useEffect(() => {
        const isDateRangeChronological = !startDate.isAfter(endDate);
        if(!isDateRangeChronological) {
            setEndDate(startDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        setFormValid(Boolean(tripName.length));
    });

    useEffect(() => {
        setForwardActionCallback(() => {
            if(hasExistingTrip) {
                return () => {
                    axios.post(SERVICE_ROUTES.editTrip, {
                        tripId: existingTrip?.tripId,
                        tripName,
                        startDate,
                        endDate
                    }).then(onSubmission);
                };
            }

            return () => {
                // New trip
                axios.post(SERVICE_ROUTES.newTrip, {
                    tripName,
                    startDate,
                    endDate
                }).then(onSubmission);
            };
        });
    }, [endDate, existingTrip?.tripId, hasExistingTrip, onSubmission, setForwardActionCallback, startDate, tripName]);

    return (
        // This marginBottom offset keeps the permanently delete option out of the initial view (requiring scroll)
        <div style={{ marginBottom: existingTrip ? '-5rem' : '' }}>
            <form className={styles.tripForm}>
                <label>
                    {text('TRIP_NAME_LABEL')}
                </label>
                <input type='text'
                       className={styles.textInput}
                       placeholder={text('TRIP_NAME_PLACEHOLDER')}
                       value={tripName}
                       autoComplete='off'
                       maxLength={60}
                       onChange={(event) => setTripName(event.target.value)}
                />

                <div className={styles.dateCount}>
                    {getDayCountMessage()}
                </div>
                <label htmlFor='start-date-input'>
                    {text('START_DATE_LABEL')}
                </label>
                <div className={styles.datePickerContainer}>
                    <DatePicker autoOk
                                disableToolbar
                                openTo='date'
                                format='MMMM D, YYYY'
                                value={startDate}
                                variant='modal'
                                className={styles.textInput}
                                onChange={setStartDate}
                    />
                </div>
                <label htmlFor='end-date-input'>
                    {text('END_DATE_LABEL')}
                </label>
                <div className={styles.datePickerContainer}>
                    <DatePicker autoOk
                                disableToolbar
                                openTo='date'
                                format='MMMM D, YYYY'
                                value={endDate}
                                variant='modal'
                                className={styles.textInput}
                                minDate={startDate}
                                minDateMessage={text('DATE_CHRONOLOGY_WARNING')}
                                onChange={setEndDate}
                    />
                </div>
            </form>
            {
                existingTrip && (
                <Link text={text('PERMANENTLY_DELETE')}
                      CustomIcon={IoTrashSharp}
                      customClass={styles.deleteLink}
                      onClickCallback={() => {
                            alert('NOT IMPLEMENTED'); // eslint-disable-line
                      }}
                />
                )
            }
        </div>
    );
}