import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';
import useContent from 'Hooks/useContent';
import { FaFilter, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import TimeFrameButton from '../TimeFrameButton/TimeFrameButton';
import MobileButton from './MobileButton/MobileButton';
import styles from './TrendsMobileNavigation.module.css';

export default function TrendsMobileNavigation() {
    const navigate = useNavigate();
    const getContent = useContent('trends');

    return (
        <nav className={styles.navContainer}>
            <MobileButton
                icon={<FaHome />}
                buttonText={getContent('dashboardButton')}
                onClick={() => {
                    navigate(PAGE_ROUTES.dashboard);
                }}
            />
            <TimeFrameButton />
            <MobileButton icon={<FaFilter />} buttonText={getContent('filterButton')} />
        </nav>
    );
}
