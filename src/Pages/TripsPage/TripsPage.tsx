import useContent from 'Hooks/useContent';
import styles from './TripsPage.module.css';

export default function TripsPage() {
    const getContent = useContent('trips');

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>{getContent('pageTitle')}</h1>
        </div>
    );
}
