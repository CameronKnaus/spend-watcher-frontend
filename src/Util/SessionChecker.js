import React from 'react';
import AuthHandler from "./AuthHandler";
import axios from "axios";
import ServiceRoutes from "../Constants/ServiceRoutes";
import {useLocation, useNavigate} from "react-router";
import {PAGE_ROUTES} from "../Constants/RouteConstants";

// The purpose of this component is to check if the user is authenticated. If not, redirect to the auth page
export default function SessionChecker({ children }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    React.useEffect(() => {
        axios.get(ServiceRoutes.checkAuthentication)
            .then(() => {
                AuthHandler.setIsAuthenticated(true);

                if(pathname === PAGE_ROUTES.authScreen) {
                    navigate(PAGE_ROUTES.dashboard);
                }
            })
            .catch(() => {
                AuthHandler.setIsAuthenticated(false);
                navigate(PAGE_ROUTES.authScreen);
            });
    }, []); //eslint-disable-line

    return children;
}