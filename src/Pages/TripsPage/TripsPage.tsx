import ErrorMessage from 'Components/ErrorMessage/ErrorMessage';
import PageContainer from 'Components/PageContainer/PageContainer';
import useContent from 'Hooks/useContent';
import useTripsList from 'Hooks/useTripsList/useTripsList';
import TripModule from './TripModule/TripModule';
import styles from './TripsPage.module.css';

export default function TripsPage() {
    const { tripsList, isLoading, isError } = useTripsList();
    const getContent = useContent('trips');
    const pageTitle = getContent('pageTitle');

    if (isLoading) {
        // TODO: Implement proper loading
        return <PageContainer pageTitle={pageTitle}>Loading...</PageContainer>;
    }

    if (isError) {
        return (
            <PageContainer pageTitle={pageTitle}>
                <ErrorMessage title={getContent('tripsPageErrorTitle')} message={getContent('tripsPageErrorMessage')} />
            </PageContainer>
        );
    }

    return (
        <PageContainer pageTitle={pageTitle}>
            <div className={styles.tripModulesContainer}>
                {tripsList?.map((tripDetails) => (
                    <TripModule
                        key={tripDetails.trip.tripId}
                        trip={tripDetails.trip}
                        tripCostTotals={tripDetails.costTotals}
                    />
                ))}
            </div>
        </PageContainer>
    );
}
