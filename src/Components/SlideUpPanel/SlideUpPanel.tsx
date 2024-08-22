import CustomButton from 'Components/CustomButton/CustomButton';
import styles from './SlideUpPanel.module.css';
import FocusLock from 'react-focus-lock';
import { ReactNode } from 'react';
import { animated, useTransition } from '@react-spring/web';

type SlideUpPanelPropTypes = {
    title: string;
    tagColor: string;
    isOpen: boolean;
    forwardButtonText?: string;
    onForwardButtonClick?: () => void;
    backButtonText?: string;
    onBackButtonClick: () => void;
    children: ReactNode;
};

export default function SlideUpPanel({
    title,
    isOpen,
    tagColor,
    forwardButtonText,
    onForwardButtonClick,
    backButtonText,
    onBackButtonClick,
    children,
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
                                <div className={styles.buttonRow}>
                                    <CustomButton
                                        variant="secondary"
                                        layout="full-width"
                                        onClick={onBackButtonClick}
                                        className={styles.button}
                                    >
                                        {backButtonText ?? 'Cancel'}
                                    </CustomButton>
                                    {onForwardButtonClick && (
                                        <CustomButton
                                            variant="primary"
                                            layout="full-width"
                                            onClick={onForwardButtonClick}
                                            className={styles.button}
                                        >
                                            {forwardButtonText ?? 'Confirm'}
                                        </CustomButton>
                                    )}
                                </div>
                            </div>
                        </animated.div>
                    </FocusLock>
                </div>
            ),
    );
}
