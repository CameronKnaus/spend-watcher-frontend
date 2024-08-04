import styles from './DesktopNavigation.module.css';
import { FaChartPie, FaHistory, FaHome, FaPlaneDeparture, FaReceipt } from 'react-icons/fa';
import { animated, useChain, useSpring, useSpringRef } from '@react-spring/web';
import { useEffect, useMemo, useRef, useState } from 'react';
import DesktopNavItem from './DesktopNavItem';
import { Outlet, useLocation } from 'react-router-dom';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';

// Time user needs to hover on menu before it expands
const MENU_OPEN_DELAY = 1500;
const DEFAULT_WIDTH = 68;

function getScrollWidth(menuListRef: React.RefObject<HTMLDivElement>) {
    if (menuListRef.current) {
        const padding = 40;
        return menuListRef.current.scrollWidth + padding;
    }

    return DEFAULT_WIDTH;
}

// This component turned out rough
export default function DesktopNavigation() {
    const [menuExpanded, setMenuExpanded] = useState(false);
    const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null | undefined>(null);
    const menuListRef = useRef<HTMLDivElement>(null);
    // If not momoized, the scrollWidth will grow on each additional render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const expandedWidth = useMemo(() => getScrollWidth(menuListRef), [menuListRef.current]);
    const location = useLocation();

    const containerSpringRef = useSpringRef();
    const containerSprings = useSpring({
        ref: containerSpringRef,
        from: {
            width: DEFAULT_WIDTH,
        },
        to: {
            width: menuExpanded ? expandedWidth : DEFAULT_WIDTH,
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

    // Close menu if the routing changes
    useEffect(() => {
        setMenuExpanded(false);
    }, [location.pathname]);

    useChain(
        menuExpanded ? [containerSpringRef, textSpringRef] : [textSpringRef, containerSpringRef],
        [0, 1],
        menuExpanded ? 300 : 50,
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
            }, MENU_OPEN_DELAY),
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
                    onMouseLeave={closeMenu}
                    // Ensure any clicks removes the menu
                    // onClick={closeMenu}
                    onMouseEnter={openMenu}
                >
                    <DesktopNavItem
                        to={PAGE_ROUTES.dashboard}
                        icon={<FaHome />}
                        text="Dashboard"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.transactions}
                        icon={<FaReceipt />}
                        text="Transactions"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.recurring_spending}
                        icon={<FaHistory />}
                        text="Recurring Spending"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.spending_trends}
                        icon={<FaChartPie />}
                        text="Trends"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
                        textSprings={textSprings}
                    />
                    <DesktopNavItem
                        to={PAGE_ROUTES.trips}
                        icon={<FaPlaneDeparture />}
                        text="Trips"
                        openMenu={openMenu}
                        onBlur={handleOnBlur}
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
