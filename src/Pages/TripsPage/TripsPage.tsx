import useContent from 'Hooks/useContent';
import useTripsList from 'Hooks/useTripsList/useTripsList';
import TripModule from './TripModule/TripModule';
import styles from './TripsPage.module.css';

export default function TripsPage() {
    const { tripsList, isLoading } = useTripsList();
    const getContent = useContent('trips');

    if (isLoading) {
        // TODO: Implement proper loading
        return 'Loading...';
    }

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>{getContent('pageTitle')}</h1>
            <div className={styles.tripModulesContainer}>
                {tripsList?.map((trip) => <TripModule key={trip.tripId} trip={trip} />)}
            </div>
        </div>
    );
}
