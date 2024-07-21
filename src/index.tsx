import './index.css';
import { createRoot } from 'react-dom/client';
import PageRoutes from 'Components/PageRoutes/PageRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import msMapper from 'Util/Time/TimeMapping';
import { StrictMode } from 'react';
import SessionChecker from 'Util/Authentication/SessionChecker';
import { IsMobileContextProvider } from 'Util/IsMobileContext';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: msMapper.day,
        },
    },
});

const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <IsMobileContextProvider>
                <BrowserRouter>
                    <SessionChecker>
                        <PageRoutes />
                    </SessionChecker>
                </BrowserRouter>
            </IsMobileContextProvider>
        </QueryClientProvider>
    </StrictMode>,
);
