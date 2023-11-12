import styles from './TripDetails.module.css';
import dayjs, { Dayjs } from 'dayjs';
import useContent from 'CustomHooks/useContent';
import formatCurrency from 'Util/Formatters/formatCurrency';
import Link from 'Components/UIElements/Navigation/Link/Link';
import TransactionsList from 'Components/Transactions/TransactionsList/TransactionsList';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import generateParamsForGET from 'Util/generateParamsForGET';
import { IoTrashSharp } from 'react-icons/io5';
import { useClosePanel } from 'Components/UIElements/Modal/SlideUpPanel/SlideUpPanel';
import axios from 'axios';
import { Trip } from 'Types/TripTypes';
import { EmptyCallback } from 'Types/QoLTypes';
import { useQueryClient } from '@tanstack/react-query';
import { transactionDependentQueryKeys } from 'Util/QueryKeys';

type TripDetailsPropTypes = {
    existingTrip: Trip,
    getDayCountMessage: (start: Dayjs, end: Dayjs) => string,
    editDetailsCallback: EmptyCallback,
}

export default function TripDetails({ existingTrip, getDayCountMessage, editDetailsCallback }: TripDetailsPropTypes) {
    const startDate = dayjs(existingTrip.startDate);
    const endDate = dayjs(existingTrip.endDate);
    const getContent = useContent('TRIPS');
    const closePanel = useClosePanel();
    const queryClient = useQueryClient();

    const isPastTrip = dayjs().isAfter(endDate);

    const { loading, response } = useFetch(SERVICE_ROUTES.getExpensesLinkedToTrip + generateParamsForGET({
        tripId: existingTrip.tripId
    }), true);

    function handleDeletion() {
        return axios.post(SERVICE_ROUTES.deleteTrip, {
            tripId: existingTrip.tripId
        }).then(() => {
            queryClient.invalidateQueries(transactionDependentQueryKeys);
        });
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.dateRange}>
                {`${startDate.format('MM/DD/YYYY')} - ${endDate.format('MM/DD/YYYY')}`}
            </div>
            <div className={styles.dataPointDescription}>
                {
                    getDayCountMessage(startDate, endDate)
                }
            </div>
            <div className={styles.dataPointDescription}>
                {
                    getContent(isPastTrip ? 'IT_COST' : 'IT_COST_SO_FAR', [formatCurrency(existingTrip.tripTotal)])
                }
            </div>
            <Link useChevron
                  text={getContent('EDIT_DETAILS')}
                  customClass={styles.editDetailsLink}
                  onClickCallback={editDetailsCallback}
            />
            <div className={styles.linkedTransactionHeader}>
                {getContent('LINKED_TRANSACTIONS')}
            </div>
            <TransactionsList transactionsList={response?.transactionList}
                              isLoading={loading}
                              skeletonLoaderCount={1}
            />
            <Link text={getContent('DELETE')}
                  CustomIcon={IoTrashSharp}
                  customClass={styles.deleteLink}
                  onClickCallback={() => {
                    handleDeletion();
                    closePanel();
                  }}
            />
        </div>
    );
}