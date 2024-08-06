import CustomButton from 'Components/CustomButton/CustomButton';
import styles from './SlideUpPanel.module.css';
import FocusLock from 'react-focus-lock';
import { ReactNode } from 'react';
import { animated, useTransition } from '@react-spring/web';

type SlideUpPanelPropTypes = {
    title: string;
    tagColor: string;
    isOpen: boolean;
    onPanelClose: () => void;
    forwardButtonText?: string;
    onForwardButtonClick?: () => void;
    backButtonText?: string;
    onBackButtonClick: () => void;
    children: ReactNode;
};

export default function SlideUpPanel({
    title,
    isOpen,
    onPanelClose,
    tagColor,
    forwardButtonText,
    onForwardButtonClick,
    backButtonText,
    onBackButtonClick,
    children,
}: SlideUpPanelPropTypes) {
    // TODO: Also transition background fade here
    const slideInTransition = useTransition(isOpen, {
        config: isOpen
            ? {
                  mass: 1,
                  tension: 300,
                  friction: 30,
              }
            : { duration: 300 },
        from: { transform: 'translate(-50%, 100vh)' },
        enter: { transform: 'translate(-50%, 0vh)' },
        leave: { transform: 'translate(-50%, 100vh)' },
    });

    // TODO: Ensure focus is set on h2 when panel is opened
    return slideInTransition(
        (animatedStyles, isOpen) =>
            isOpen && (
                <div className={styles.container}>
                    <div className={styles.lockedBackground} />
                    <FocusLock returnFocus>
                        <animated.div aria-modal role="dialog" className={styles.panelContainer} style={animatedStyles}>
                            <div className={styles.titleTag} style={{ backgroundColor: tagColor }}>
                                <h2 tabIndex={0} className={styles.title}>
                                    {title}
                                </h2>
                            </div>
                            <div className={styles.panelContent}>
                                <div className={styles.scrollableArea}>{children}</div>
                                <div className={styles.buttonRow}>
                                    <CustomButton
                                        variant="secondary"
                                        text={backButtonText ?? 'Cancel'}
                                        layout="full-width"
                                        onClick={onBackButtonClick}
                                    />
                                    {onForwardButtonClick && (
                                        <CustomButton
                                            variant="primary"
                                            text={forwardButtonText ?? 'Confirm'}
                                            layout="full-width"
                                            onClick={onForwardButtonClick}
                                        />
                                    )}
                                </div>
                            </div>
                        </animated.div>
                    </FocusLock>
                </div>
            ),
    );
}
