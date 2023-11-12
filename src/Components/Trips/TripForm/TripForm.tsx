import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './TripForm.module.css';
import Link from 'Components/UIElements/Navigation/Link/Link';
import { IoTrashSharp } from 'react-icons/io5';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { Trip } from 'Types/TripTypes';
import { EmptyCallback } from 'Types/QoLTypes';
import { useQueryClient } from '@tanstack/react-query';
import { tripDependentQueryKeys } from 'Util/QueryKeys';

type TripFromPropTypes = {
    existingTrip?: Trip;
    setForwardActionCallback: Dispatch<SetStateAction<EmptyCallback>>;
    getDayCountMessage: (start: Dayjs, end: Dayjs) => string;
    setFormValid: Dispatch<SetStateAction<boolean>>;
}

export default function TripForm({ existingTrip, setForwardActionCallback, getDayCountMessage, setFormValid }: TripFromPropTypes) {
    const text = useContent('TRIPS');

    // State for form values
    const [tripName, setTripName] = useState(existingTrip?.tripName ?? '');
    const [startDate, setStartDate] = useState(existingTrip?.startDate ? dayjs(existingTrip?.startDate) : dayjs());
    const [endDate, setEndDate] = useState(existingTrip?.endDate ? dayjs(existingTrip?.endDate) : dayjs());
    const hasExistingTrip = Boolean(existingTrip);
    const queryClient = useQueryClient();

    useEffect(() => {
        const isDateRangeChronological = !startDate.isAfter(endDate);
        if(!isDateRangeChronological) {
            setEndDate(startDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        setFormValid(Boolean(tripName.length && startDate.isValid() && endDate.isValid()));
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
                    }).then(() => {
                        queryClient.invalidateQueries(tripDependentQueryKeys);
                    });
                };
            }

            return () => {
                // New trip
                axios.post(SERVICE_ROUTES.newTrip, {
                    tripName,
                    startDate,
                    endDate
                }).then(() => {
                    queryClient.invalidateQueries(tripDependentQueryKeys);
                });
            };
        });
    }, [endDate, existingTrip?.tripId, hasExistingTrip, queryClient, setForwardActionCallback, startDate, tripName]);

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
                    {getDayCountMessage(startDate, endDate)}
                </div>
                <label htmlFor='start-date-input'>
                    {text('START_DATE_LABEL')}
                </label>
                <div className={styles.datePickerContainer}>
                    <DatePicker views={['year', 'month', 'day']}
                                format='MMMM D, YYYY'
                                value={startDate}
                                className={styles.textInput}
                                onChange={(value) => {
                                    value && setStartDate(value);
                                }}
                    />
                </div>
                <label htmlFor='end-date-input'>
                    {text('END_DATE_LABEL')}
                </label>
                <div className={styles.datePickerContainer}>
                    <DatePicker views={['year', 'month', 'day']}
                                format='MMMM D, YYYY'
                                value={endDate}
                                minDate={startDate}
                                className={styles.textInput}
                                onChange={(value) => {
                                    value && setEndDate(value);
                                }}
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