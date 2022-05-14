import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { PAGE_ROUTES } from './Constants/RouteConstants';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormFactorContext from './Util/FormFactorContext';
import Dashboard from './Pages/Dashboard';
import AuthScreen from './Pages/AuthScreen';
import SessionChecker from './Util/SessionChecker';
import TransactionSummary from './Pages/TransactionSummary';

const projectRoot = ReactDOM.createRoot(document.getElementById('root'));

projectRoot.render(
    <React.StrictMode>
        <FormFactorContext>
            <BrowserRouter>
                <SessionChecker>
                    <Routes>
                        <Route path={PAGE_ROUTES.dashboard} element={<Dashboard />} />
                        <Route path={PAGE_ROUTES.authScreen} element={<AuthScreen />} />
                        <Route path={PAGE_ROUTES.transactionSummary} element={<TransactionSummary />} />
                    </Routes>
                </SessionChecker>
            </BrowserRouter>
        </FormFactorContext>
    </React.StrictMode>
);
