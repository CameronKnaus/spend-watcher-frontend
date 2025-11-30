import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SelectedTimeFrameProvider from 'Contexts/SelectedTimeFrame.context';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { IsMobileContextProvider } from 'Util/IsMobileContext';
import PageRoutes from 'Components/PageRoutes/PageRoutes';
import msMapper from 'Util/Time/TimeMapping';
import './main.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: msMapper.day,
        },
    },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
    <StrictMode>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <QueryClientProvider client={queryClient}>
                <IsMobileContextProvider>
                    <BrowserRouter>
                        <SelectedTimeFrameProvider>
                            <PageRoutes />
                        </SelectedTimeFrameProvider>
                    </BrowserRouter>
                </IsMobileContextProvider>
            </QueryClientProvider>
        </LocalizationProvider>
    </StrictMode>,
);
