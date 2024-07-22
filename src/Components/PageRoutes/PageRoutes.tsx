// import Dashboard from 'Pages/Dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom';
import AuthScreen from 'Pages/AuthScreen/AuthScreen';
// import SpendingBreakdown from 'Pages/SpendingBreakdown/SpendingBreakdown';
// import RecurringSpending from 'Pages/RecurringSpending/RecurringSpending';

const spendingBreakdown = '/spending';
export const PAGE_ROUTES: Record<string, string> = {
    dashboard: '/',
    authScreen: '/auth',
    spendingHistory: `${spendingBreakdown}/history`,
    spendingSummary: `${spendingBreakdown}/summary`,
    spendingBreakdown: `${spendingBreakdown}/:defaultTab`,
    recurringSpending: '/recurring',
};

export default function PageRoutes() {
    return (
        <Routes>
            <Route path={PAGE_ROUTES.dashboard} element={<div>Hello</div>} />
            <Route path={PAGE_ROUTES.authScreen} element={<AuthScreen />} />
            {/* <Route path={PAGE_ROUTES.spendingBreakdown} element={<SpendingBreakdown />} />
            <Route path={PAGE_ROUTES.recurringSpending} element={<RecurringSpending />} /> */}
        </Routes>
    );
}
