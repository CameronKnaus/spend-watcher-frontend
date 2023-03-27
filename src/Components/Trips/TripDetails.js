import styles from 'Styles/Components/Trips/TripDetails.module.css';
import dayjs from 'dayjs';
import useContent from 'CustomHooks/useContent';
import formatCurrency from 'Util/formatCurrency';
import Link from 'Components/UIElements/Navigation/Link';
import TransactionsList from 'Components/Transactions/TransactionsList';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useFetch from 'CustomHooks/useFetch';
import generateParamsForGET from 'Util/generateParamsForGET';
import { useEffect } from 'react';
import { IoTrashSharp } from 'react-icons/io5';
import { useClosePanel } from 'Components/UIElements/Modal/SlideUpPanel';
import axios from '../../../node_modules/axios/index';

export default function TripDetails({ existingTrip, getDayCountMessage, editDetailsCallback, refreshRequested, callForRefresh  }) {
    const startDate = dayjs(existingTrip.startDate);
    const endDate = dayjs(existingTrip.endDate);
    const getContent = useContent('TRIPS');
    const closePanel = useClosePanel();

    const isPastTrip = dayjs().isAfter(endDate);

    const { loading, response, fire } = useFetch(SERVICE_ROUTES.getExpensesLinkedToTrip + generateParamsForGET({
        tripId: existingTrip.tripId
    }), true);

    useEffect(() => {
        if(refreshRequested) {
            fire(true);
        }
    }, [fire, refreshRequested]);

    function handleDeletion() {
        return axios.post(SERVICE_ROUTES.deleteTrip, {
            tripId: existingTrip.tripId
        }).then(callForRefresh);
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
                              onEditCallback={callForRefresh}
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