import styles from './TripDetails.module.css';
import dayjs, { Dayjs } from 'dayjs';
import useContent from 'CustomHooks/useContent';
import formatCurrency from 'Util/Formatters/formatCurrency';
import Link from 'Components/UIElements/Navigation/Link/Link';
import TransactionsList from 'Components/Transactions/TransactionsList/TransactionsList';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import generateParamsForGET from 'Util/generateParamsForGET';
import { IoTrashSharp } from 'react-icons/io5';
import { useClosePanel } from 'Components/UIElements/Modal/SlideUpPanel/SlideUpPanel';
import axios from 'axios';
import { Trip } from 'Types/TripTypes';
import { EmptyCallback } from 'Types/QoLTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, transactionDependentQueryKeys, tripDetailsQueryKey } from 'Util/QueryKeys';
import tripDetailsTransform from './tripDetailsTransform';

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

    const { isLoading, data: transactionResponse } = useQuery({
        queryKey: [
            tripDetailsQueryKey, existingTrip.tripId
        ],
        queryFn: () => {
            const endpoint = SERVICE_ROUTES.getExpensesLinkedToTrip + generateParamsForGET({
                tripId: existingTrip.tripId
            });
            return axios.get(endpoint);
        },
        select: tripDetailsTransform
    });


    function handleDeletion() {
        return axios.post(SERVICE_ROUTES.deleteTrip, {
            tripId: existingTrip.tripId
        }).then(() => {
            invalidateQueries(queryClient, transactionDependentQueryKeys);
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
            <TransactionsList transactionsList={transactionResponse?.transactionList}
                              isLoading={isLoading}
                              skeletonLoaderCount={1}
                              hasTotalsRow={false}
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