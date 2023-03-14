import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import { PAGE_ROUTES } from './Constants/RouteConstants';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { IsMobileContextProvider } from './Util/IsMobileContext';
import dayjs from '@date-io/dayjs'; // Using DayJS for material-ui date picker handling
import Dashboard from './Pages/Dashboard';
import AuthScreen from './Pages/AuthScreen';
import SessionChecker from './Util/SessionChecker';
import SpendingBreakdown from './Pages/SpendingBreakdown';
import DayJS from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import RecurringSpending from 'Pages/RecurringSpending';

DayJS.extend(LocalizedFormat);
DayJS.extend(duration);

ReactDOM.render(
    <React.StrictMode>
        <MuiPickersUtilsProvider utils={dayjs}>
            <IsMobileContextProvider>
                <BrowserRouter>
                    <SessionChecker>
                        <Routes>
                            <Route path={PAGE_ROUTES.dashboard} element={<Dashboard />} />
                            <Route path={PAGE_ROUTES.authScreen} element={<AuthScreen />} />
                            <Route path={PAGE_ROUTES.spendingBreakdown} element={<SpendingBreakdown />} />
                            <Route path={PAGE_ROUTES.recurringSpending} element={<RecurringSpending />} />
                        </Routes>
                    </SessionChecker>
                </BrowserRouter>
            </IsMobileContextProvider>
        </MuiPickersUtilsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
