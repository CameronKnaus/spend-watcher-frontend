import { Outlet } from 'react-router-dom';
import styles from './MobileNavigation.module.css';
import MobileNavItem from './MobileNavItem';
import { FaChartPie, FaHistory, FaHome, FaPlaneDeparture, FaReceipt } from 'react-icons/fa';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';

export default function MobileNavigation() {
    return (
        <>
            <nav className={styles.navContainer}>
                <MobileNavItem to={PAGE_ROUTES.dashboard} icon={<FaHome />} text="Dashboard" />
                <MobileNavItem to={PAGE_ROUTES.transactions} icon={<FaReceipt />} text="Transactions" />
                <MobileNavItem to={PAGE_ROUTES.spending_trends} icon={<FaChartPie />} text="Trends" />
                <MobileNavItem to={PAGE_ROUTES.recurring_spending} icon={<FaHistory />} text="Recurring" />
                <MobileNavItem to={PAGE_ROUTES.trips} icon={<FaPlaneDeparture />} text="Trips" />
            </nav>
            <div className={styles.outletContainer}>
                <Outlet data-testid="outlet-container" />
            </div>
        </>
    );
}
