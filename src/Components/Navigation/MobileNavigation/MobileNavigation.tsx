import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';
import { FaChartPie, FaHistory, FaHome, FaPlaneDeparture, FaReceipt } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import styles from './MobileNavigation.module.css';
import MobileNavItem from './MobileNavItem';

export default function MobileNavigation() {
    return (
        <>
            <div className={styles.outletContainer}>
                <Outlet data-testid="outlet-container" />
                <div className={styles.outletSpacer} />
            </div>
            <nav className={styles.navContainer}>
                <MobileNavItem to={PAGE_ROUTES.dashboard} icon={<FaHome />} text="Dashboard" />
                <MobileNavItem to={PAGE_ROUTES.transactions} icon={<FaReceipt />} text="Transactions" />
                <MobileNavItem to={PAGE_ROUTES.spending_trends} icon={<FaChartPie />} text="Trends" />
                <MobileNavItem to={PAGE_ROUTES.recurring_spending} icon={<FaHistory />} text="Recurring" />
                <MobileNavItem to={PAGE_ROUTES.trips} icon={<FaPlaneDeparture />} text="Trips" />
            </nav>
        </>
    );
}
