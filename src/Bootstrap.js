import { StrictMode } from 'react';
import DayJS from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import dayjs from '@date-io/dayjs'; // Using DayJS for material-ui date picker handling
import { TripsContextProvider } from 'Contexts/trips/TripsContext';
import SessionChecker from './Util/SessionChecker';
import { BrowserRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { IsMobileContextProvider } from './Util/IsMobileContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

DayJS.extend(LocalizedFormat);
DayJS.extend(duration);

const queryClient = new QueryClient();

export default function Bootstrap({ children }) {
    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <MuiPickersUtilsProvider utils={dayjs}>
                    <IsMobileContextProvider>
                        <TripsContextProvider>
                            <BrowserRouter>
                                <SessionChecker>
                                    {children}
                                </SessionChecker>
                            </BrowserRouter>
                        </TripsContextProvider>
                    </IsMobileContextProvider>
                </MuiPickersUtilsProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}