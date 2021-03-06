import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../../Styles/Components/UIElements/SlideUpPanel.module.css';

// This context is provided to all children to give them access to the closePanel method
const ClosePanel = React.createContext(() => { /* NOOP */ });

// If 'confirmText' and 'closeText' are provided, two buttons will appear at the bottom
// If only 'closeText' is provided then only one button will appear at the bottom that closes the panel
// All children of the SLideUpPanel will be given the closePanel function prop
export default function SlideUpPanel({ children, onPanelClose, closeText, confirmText, title, forwardActionCallback = () => { /* NOOP */ }, disableConfirmButton }) {
    // Grab ref of panel for handling tabbing
    const panelRef = React.useRef();
    const titleRef = React.useRef();

    const [panelClosing, setPanelClosing] = React.useState(false);

    const keystrokeHandlers = React.useMemo(() => ({
        // Tab Key
        9: handleTabPress,
        // Escape Key
        27: onPanelClose
    }), [onPanelClose]);


    React.useEffect(() => {
        // Lock scrolling
        document.body.style.overflow = 'hidden';

        // Set focus on title load
        // const x = window.scrollX, y = window.scrollY;
        titleRef.current.focus();
        // window.scrollTo(x, y);

        return () => { document.body.style.overflow = 'auto' };
    }, []);

    // Event listeners to handle keystrokes
    React.useEffect(() => {
        const handleKeyPress = (event) => {
            const handler = keystrokeHandlers[event.keyCode];
            handler && handler();
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [keystrokeHandlers]);

    // Handling Tab Presses to create focus trap inside the panel
    function handleTabPress(event) {
        const focusableElements = panelRef.current.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );

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
                <div className={styles.titleTag}>
                    <h2 ref={titleRef} tabIndex={0} className={styles.title}>
                        {title}
                    </h2>
                </div>
                <div className={styles.panelContent}>
                    <div className={styles.scrollableArea}>
                        {/* Provide the close panel function to all children inside the slideUpPanel*/}
                        <ClosePanel.Provider value={{ closePanel }}>
                            {children}
                        </ClosePanel.Provider>
                    </div>
                    <div className={styles.buttonRow}>
                        <button className={`${styles.buttons} ${styles.closeButton}`}
                                onClick={closePanel}
                        >
                            {closeText}
                        </button>
                        {
                            confirmText && (
                                <button className={`${styles.buttons} ${disableConfirmButton ? styles.disabledButton : styles.forwardActionButton}`}
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