import { StrictMode } from 'react';
import DayJS from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import { TripsContextProvider } from 'Contexts/trips/TripsContext';
import SessionChecker from './Util/SessionChecker';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { IsMobileContextProvider } from './Util/IsMobileContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

DayJS.extend(LocalizedFormat);
DayJS.extend(duration);

const queryClient = new QueryClient();

export default function Bootstrap({ children }) {
    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <IsMobileContextProvider>
                        <TripsContextProvider>
                            <BrowserRouter>
                                <SessionChecker>
                                    {children}
                                </SessionChecker>
                            </BrowserRouter>
                        </TripsContextProvider>
                    </IsMobileContextProvider>
                </LocalizationProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}