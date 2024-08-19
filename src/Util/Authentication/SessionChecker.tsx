import { useEffect } from 'react';
import axios from 'axios';
import ServiceRoutes from 'Constants/ServiceRoutes';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';

// TODO: Needs fixed
// The purpose of this component is to check if the user is authenticated. If not, redirect to the auth page
export default function SessionChecker({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // If successful, user is verified.  If error, user is not verified.  Otherwise loading.
    const { isError, isLoading, isFetching } = useQuery({
        queryKey: ['verify-auth'],
        queryFn: () => axios.get(ServiceRoutes.getCheckAuthentication),
        staleTime: 100 * 60 * 30, // Reverify authentication every 30 mins, this may not be necessary, will (probably not) revisit
    });

    // useEffect(() => {
    //     if (isLoading || isFetching) {
    //         return;
    //     }

    //     if (isError) {
    //         navigate(PAGE_ROUTES.auth);
    //     }

    //     // Move to dashboard if the user is verified but still on the auth screen
    //     else if (pathname === PAGE_ROUTES.auth) {
    //         navigate(PAGE_ROUTES.dashboard);
    //     }
    // }, [isError, isFetching, isLoading, navigate, pathname]);

    return children;
}
