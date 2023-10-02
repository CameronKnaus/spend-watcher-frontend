import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './SlideUpPanel.module.css';
import { EmptyCallback } from 'Types/QoLTypes';
import { Color } from 'Types/StyleTypes';

// This context is provided to all children to give them access to the closePanel method
const ClosePanel = createContext(() => { /* NOOP */ });

type SlideUpPanelPropTypes = {
    children: any,
    onPanelClose: EmptyCallback,
    closeText: string,
    confirmText: string,
    title: string,
    forwardActionCallback: EmptyCallback,
    backwardsActionCallback?: EmptyCallback, // Defaults to closing the panel if not provided
    disableConfirmButton: boolean,
    tagColor?: Color,
    hideTag: boolean,
    forwardActionButtonColor: Color
}

// If 'confirmText' and 'closeText' are provided, two buttons will appear at the bottom
// If only 'closeText' is provided then only one button will appear at the bottom that closes the panel
// All children of the SLideUpPanel will be given the closePanel function prop
// tagColor - String - CSS color value for the top tag of the slideUpPanel, defaults to red
export default function SlideUpPanel({ children,
    onPanelClose,
    closeText,
    confirmText,
    title,
    forwardActionCallback = () => { /* NOOP */ },
    backwardsActionCallback, // Defaults to closing the panel if not provided
    disableConfirmButton,
    tagColor = 'var(--theme-red-dark)',
    hideTag = false,
    forwardActionButtonColor }: SlideUpPanelPropTypes) {
    // Grab ref of panel for handling tabbing
    const panelRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const [panelClosing, setPanelClosing] = useState(false);

    const keystrokeHandlers: Record<string, (e: KeyboardEvent) => void> = useMemo(() => ({
        Tab: handleTabPress,
        Escape: onPanelClose
    }), [onPanelClose]);


    useEffect(() => {
        // Lock scrolling
        document.body.style.overflow = 'hidden';

        // Set focus on title load
        titleRef?.current?.focus();

        return () => { document.body.style.overflow = 'auto' };
    }, []);

    // Event listeners to handle keystrokes
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const handler = keystrokeHandlers[event.code];
            handler && handler(event);
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [keystrokeHandlers]);

    // Handling Tab Presses to create focus trap inside the panel
    function handleTabPress(event: KeyboardEvent) {
        const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );

        if(!focusableElements) {
            return;
        }

        // TODO: Fix this
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift held, moving focus in reverse order
        if(event.shiftKey && document.activeElement !== lastElement) {
            lastElement.focus();
            event.preventDefault();
            return;
        }

        // Shift not held, moving focus in forward order
        if(document.activeElement !== firstElement) {
            firstElement.focus();
            event.preventDefault();
        }
    }

    function closePanel() {
        setPanelClosing(true);

        // Fire the panel closed callback after the animation plays
        setTimeout(onPanelClose, 500);
    }

    // For buttons like 'submit' or 'confirm'
    function forwardAction() {
        forwardActionCallback();

        closePanel();
    }

    return createPortal(
        <>
            <div className={`${styles.lockedBackground} ${panelClosing ? styles.unlockedBackground : ''}`} onClick={closePanel} />
            <div ref={panelRef}
                 aria-modal
                 role='dialog'
                 className={`${styles.panelContainer} ${panelClosing ? styles.panelClosing : ''}`}
            >
                {
                    !hideTag && (
                        <div className={styles.titleTag} style={{ backgroundColor: tagColor }}>
                            <h2 ref={titleRef} tabIndex={0} className={styles.title}>
                                {title}
                            </h2>
                        </div>
                    )
                }
                <div className={styles.panelContent}>
                    <div className={styles.scrollableArea}>
                        {/* Provide the close panel function to all children inside the slideUpPanel*/}
                        <ClosePanel.Provider value={closePanel}>
                            {children}
                        </ClosePanel.Provider>
                    </div>
                    <div className={styles.buttonRow}>
                        <button className={`${styles.buttons} ${styles.closeButton}`}
                                onClick={backwardsActionCallback ? backwardsActionCallback : closePanel}
                        >
                            {closeText}
                        </button>
                        {
                            confirmText && (
                                <button className={`${styles.buttons} ${disableConfirmButton ? styles.disabledButton : styles.forwardActionButton}`}
                                        style={{ backgroundColor: forwardActionButtonColor }}
                                        onClick={() => !disableConfirmButton && forwardAction()}
                                >
                                    {confirmText}
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

export { ClosePanel };

export function useClosePanel() {
    return useContext(ClosePanel);
}