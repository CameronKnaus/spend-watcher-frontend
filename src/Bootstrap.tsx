import { ReactElement, StrictMode } from 'react';
import DayJS from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import SessionChecker from './Util/Authentication/SessionChecker';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { IsMobileContextProvider } from './Util/IsMobileContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import msMapper from 'Util/Time/TimeMapping';

DayJS.extend(LocalizedFormat);
DayJS.extend(duration);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: msMapper.day
        }
    }
});

export default function Bootstrap({ children }: { children: ReactElement }) {
    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <IsMobileContextProvider>
                        <BrowserRouter>
                            <SessionChecker>
                                {children}
                            </SessionChecker>
                        </BrowserRouter>
                    </IsMobileContextProvider>
                </LocalizationProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}