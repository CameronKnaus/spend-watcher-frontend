import { animated, useTransition } from '@react-spring/web';
import { ReactNode } from 'react';
import FocusLock from 'react-focus-lock';
import styles from './SlideUpPanel.module.css';

type SlideUpPanelPropTypes = {
    title: string;
    tagColor: string;
    isOpen: boolean;
    children: ReactNode;
    bottomSheetContents?: ReactNode;
};

export default function SlideUpPanel({
    title,
    isOpen,
    tagColor,
    children,
    bottomSheetContents,
}: SlideUpPanelPropTypes) {
    const slideInTransition = useTransition(isOpen, {
        config: {
            mass: 1,
            tension: 300,
            friction: 30,
        },
        from: { transform: 'translate(-50%, 100vh)', opacity: 0 },
        enter: { transform: 'translate(-50%, 0vh)', opacity: 1 },
        leave: { transform: 'translate(-50%, 100vh)', opacity: 0 },
    });

    return slideInTransition(
        (animatedStyles, isOpen) =>
            isOpen && (
                <div className={styles.container}>
                    <animated.div className={styles.lockedBackground} style={{ opacity: animatedStyles.opacity }} />
                    <FocusLock returnFocus>
                        <animated.div
                            aria-modal
                            role="dialog"
                            className={styles.panelContainer}
                            style={{ transform: animatedStyles.transform }}
                        >
                            <div className={styles.titleTag} style={{ backgroundColor: tagColor }}>
                                <h2 tabIndex={0} className={styles.title}>
                                    {title}
                                </h2>
                            </div>
                            <div className={styles.panelContent}>
                                <div className={styles.scrollableArea}>{children}</div>
                                {/* TODO: Maybe decommission bottomSheetContents and put responsibility on component consumer to handle any buttons */}
                                {bottomSheetContents && <div className={styles.bottomSheet}>{bottomSheetContents}</div>}
                            </div>
                        </animated.div>
                    </FocusLock>
                </div>
            ),
    );
}
