import './index.css';
import ReactDOM from 'react-dom';
import { PAGE_ROUTES } from './Constants/RouteConstants';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import AuthScreen from './Pages/AuthScreen/AuthScreen';
import Bootstrap from './Bootstrap';
import SpendingBreakdown from './Pages/SpendingBreakdown/SpendingBreakdown';
import RecurringSpending from 'Pages/RecurringSpending/RecurringSpending';


ReactDOM.render(
    <Bootstrap>
        <Routes>
            <Route path={PAGE_ROUTES.dashboard} element={<Dashboard />} />
            <Route path={PAGE_ROUTES.authScreen} element={<AuthScreen />} />
            <Route path={PAGE_ROUTES.spendingBreakdown} element={<SpendingBreakdown />} />
            <Route path={PAGE_ROUTES.recurringSpending} element={<RecurringSpending />} />
        </Routes>
    </Bootstrap>,
    document.getElementById('root')
);
