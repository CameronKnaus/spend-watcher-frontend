import styles from './DesktopNavigation.module.css';
import { FaChartPie, FaHistory, FaHome, FaPlaneDeparture, FaReceipt } from 'react-icons/fa';
import { animated, useChain, useSpring, useSpringRef } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import DesktopNavItem from './DesktopNavItem';
import { Outlet, useLocation } from 'react-router-dom';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';

// This component turned out rough
export default function DesktopNavigation() {
    const DEFAULT_WIDTH = 68;
    const [potentialWidth, setPotentialWidth] = useState(DEFAULT_WIDTH);
    const [menuExpanded, setMenuExpanded] = useState(false);
    const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null | undefined>(null);
    const menuListRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const containerSpringRef = useSpringRef();
    const containerSprings = useSpring({
        ref: containerSpringRef,
        from: {
            width: DEFAULT_WIDTH,
        },
        to: {
            width: menuExpanded ? potentialWidth : DEFAULT_WIDTH,
        },
        config: {
            mass: 1.1,
        },
    });

    const textSpringRef = useSpringRef();
    const textSprings = useSpring({
        ref: textSpringRef,
        from: {
            opacity: 0,
        },
        opacity: menuExpanded ? 1 : 0,
    });

    useEffect(() => {
        if (menuListRef.current) {
            const padding = 40;
            setPotentialWidth(menuListRef.current.scrollWidth + padding);
        }
    }, []);

    // Close menu if the routing changes
    useEffect(() => {
        setMenuExpanded(false);
    }, [location.pathname]);

    useChain(
        menuExpanded ? [containerSpringRef, textSpringRef] : [textSpringRef, containerSpringRef],
        [0, 1],
        menuExpanded ? 500 : 100,
    );

    function handleOnBlur() {
        if (delayHandler) {
            clearTimeout(delayHandler);
        }

        setTimeout(() => {
            if (!menuListRef.current?.contains(document.activeElement)) {
                closeMenu();
            }
        }, 100);
    }

    function closeMenu() {
        setMenuExpanded(false);
        if (delayHandler) {
            clearTimeout(delayHandler);
        }
    }

    function openMenu() {
        setDelayHandler(
            setTimeout(() => {
                setMenuExpanded(true);
            }, 1000),
        );
    }

    // TODO: Determine new content process, replace hardcoded text
    return (
        <>
            <div className={styles.desktopNav}>
                <animated.nav
                    ref={menuListRef}
                    className={styles.menuList}
                    style={containerSprings}
                    onMouseEnter={openMenu}
                    onMouseLeave={closeMenu}
                >
                    <DesktopNavItem
                        to={PAGE_ROUTES.dashboard}
                        icon={<FaHome />}
                        text="Dashboard"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        closeMenu={closeMenu}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.transactions}
                        icon={<FaReceipt />}
                        text="Transactions"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        closeMenu={closeMenu}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.recurring_spending}
                        icon={<FaHistory />}
                        text="Recurring Spending"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        closeMenu={closeMenu}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.spending_trends}
                        icon={<FaChartPie />}
                        text="Trends"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        closeMenu={closeMenu}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.trips}
                        icon={<FaPlaneDeparture />}
                        text="Trips"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        closeMenu={closeMenu}
                        textSprings={textSprings}
                    />
                </animated.nav>
            </div>
            <div style={{ paddingLeft: DEFAULT_WIDTH }}>
                <Outlet />
            </div>
        </>
    );
}
