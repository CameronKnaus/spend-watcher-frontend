import { NavLink, useLocation } from 'react-router-dom';
import styles from './DesktopNavigation.module.css';
import { animated, SpringValues, useSpring } from '@react-spring/web';

type DesktopNavItemPropTypes = {
    to: string;
    icon: React.ReactNode;
    text: string;
    textSprings: SpringValues<{
        opacity: number;
    }>;
    openMenu: () => void;
    onBlur: () => void;
    closeMenu: () => void;
};

export default function DesktopNavItem({
    to,
    icon,
    text,
    textSprings,
    openMenu,
    onBlur,
    closeMenu,
}: DesktopNavItemPropTypes) {
    const isCurrentRoute = useLocation().pathname === to;

    const iconSprings = useSpring({
        from: {
            color: 'rgb(70, 80, 83)', // --token-navigation-color
        },
        to: isCurrentRoute
            ? {
                  color: 'rgb(255, 255, 255)',
              }
            : {
                  color: 'rgb(70, 80, 83)', // --token-navigation-color
              },
    });

    const selectionState = isCurrentRoute
        ? {
              width: '100%',
              height: '100%',
          }
        : {
              width: '0%',
              height: '0%',
          };

    const selectionSprings = useSpring({
        from: selectionState,
        to: selectionState,
        config: {
            mass: 1,
            friction: 15,
            tension: 80,
        },
    });

    return (
        <NavLink to={to} className={styles.menuItem} onFocus={openMenu} onBlur={onBlur} onClick={closeMenu}>
            <div className={styles.icon}>
                <animated.div className={styles.selectionBackground} style={selectionSprings} />
                <animated.span style={iconSprings}>{icon}</animated.span>
            </div>
            <div className={styles.navTextContainer}>
                <animated.span style={textSprings}>{text}</animated.span>
            </div>
        </NavLink>
    );
}
