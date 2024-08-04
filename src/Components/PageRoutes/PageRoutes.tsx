// import Dashboard from 'Pages/Dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom';
import AuthScreen from 'Pages/AuthScreen/AuthScreen';
import { useIsMobile } from 'Util/IsMobileContext';
import MobileNavigation from 'Components/Navigation/MobileNavigation/MobileNavigation';
import DesktopNavigation from 'Components/Navigation/DesktopNavigation/DesktopNavigation';
import Dashboard from 'Pages/Dashboard/Dashboard';
// import SpendingBreakdown from 'Pages/SpendingBreakdown/SpendingBreakdown';
// import RecurringSpending from 'Pages/RecurringSpending/RecurringSpending';

export enum PageName {
    dashboard = 'dashboard',
    auth = 'auth',
    transactions = 'transactions',
    recurring_spending = 'recurring_spending',
    spending_trends = 'spending_trends',
    trips = 'trips',
}

export const PAGE_ROUTES: Record<PageName, `/${PageName}`> = {
    dashboard: '/dashboard',
    auth: '/auth',
    transactions: '/transactions',
    spending_trends: '/spending_trends',
    recurring_spending: '/recurring_spending',
    trips: '/trips',
};

export default function PageRoutes() {
    const isMobile = useIsMobile();

    return (
        <Routes>
            <Route element={isMobile ? <MobileNavigation /> : <DesktopNavigation />}>
                <Route path={PAGE_ROUTES.dashboard} element={<Dashboard />} />
                <Route path={PAGE_ROUTES.transactions} element={<h1>Transactions</h1>} />
                <Route path={PAGE_ROUTES.spending_trends} element={<h1>Spending trends</h1>} />
                <Route path={PAGE_ROUTES.recurring_spending} element={<h1>Recurring spending</h1>} />
                <Route path={PAGE_ROUTES.trips} element={<h1>Trips</h1>} />
            </Route>
            <Route path={PAGE_ROUTES.auth} element={<AuthScreen />} />

            {/* <Route path={PAGE_ROUTES.spendingBreakdown} element={<SpendingBreakdown />} />
                <Route path={PAGE_ROUTES.recurringSpending} element={<RecurringSpending />} /> */}
        </Routes>
    );
}
