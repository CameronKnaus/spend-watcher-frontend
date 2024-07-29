import { NavLink, useLocation } from 'react-router-dom';
import styles from './MobileNavigation.module.css';
import { animated, useSpring } from '@react-spring/web';

type MobileNavItemPropTypes = {
    to: string;
    icon: React.ReactNode;
    text: string;
};

export default function MobileNavItem({ to, icon, text }: MobileNavItemPropTypes) {
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
        <NavLink to={to} className={styles.menuItem}>
            <div className={styles.icon}>
                <animated.div className={styles.selectionBackground} style={selectionSprings} />
                <animated.span style={iconSprings}>{icon}</animated.span>
            </div>
            <div className={styles.navLabel}>{text}</div>
        </NavLink>
    );
}
