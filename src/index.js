import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import { PAGE_ROUTES } from './Constants/RouteConstants';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormFactorContext from './Util/FormFactorContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import dayjs from '@date-io/dayjs'; // Using DayJS for material-ui date picker handling
import Dashboard from './Pages/Dashboard';
import AuthScreen from './Pages/AuthScreen';
import SessionChecker from './Util/SessionChecker';
import TransactionSummary from './Pages/TransactionSummary';
import SpendingSummary from './Containers/SpendingSummary';

ReactDOM.render(
    <React.StrictMode>
        <MuiPickersUtilsProvider utils={dayjs}>
            <FormFactorContext>
                <BrowserRouter>
                    <SessionChecker>
                        <Routes>
                            <Route path={PAGE_ROUTES.dashboard} element={<Dashboard />} />
                            <Route path={PAGE_ROUTES.authScreen} element={<AuthScreen />} />
                            <Route path={PAGE_ROUTES.transactionSummary} element={<TransactionSummary />} />
                            <Route path={PAGE_ROUTES.spendingSummary} element={<SpendingSummary />} />
                        </Routes>
                    </SessionChecker>
                </BrowserRouter>
            </FormFactorContext>
        </MuiPickersUtilsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
