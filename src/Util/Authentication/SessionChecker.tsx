import { useEffect } from 'react';
import AuthHandler from './AuthHandler';
import axios from 'axios';
import ServiceRoutes from 'Constants/ServiceRoutes';
import { useLocation, useNavigate } from 'react-router';
import { PAGE_ROUTES } from 'Constants/RouteConstants';
import { useQuery } from '@tanstack/react-query';

// The purpose of this component is to check if the user is authenticated. If not, redirect to the auth page
export default function SessionChecker({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // If successful, user is verified.  If error, user is not verified.  Otherwise loading.
    const { isError, isLoading, isFetching } = useQuery({
        queryKey: ['verify-auth'],
        queryFn: () => axios.get(ServiceRoutes.checkAuthentication).then(() => AuthHandler.setIsAuthenticated(true)),
        staleTime: 100 * 60 * 30, // 30 min,
    });

    useEffect(() => {
        if (isLoading || isFetching) {
            return;
        }

        if (isError) {
            AuthHandler.setIsAuthenticated(false);
            navigate(PAGE_ROUTES.authScreen);
        }

        // Move to dashboard if the user is verified but still on the auth screen
        if (pathname === PAGE_ROUTES.authScreen) {
            navigate(PAGE_ROUTES.dashboard);
        }
    }, [isError, isFetching, isLoading, navigate, pathname]);

    return children;
}
