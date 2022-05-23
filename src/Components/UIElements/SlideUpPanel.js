import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../../Styles/Components/UIElements/SlideUpPanel.module.css';

// If 'confirmText' and 'closeText' are provided, two buttons will appear at the bottom
// If only 'closeText' is provided then only one button will appear at the bottom that closes the panel
export default function SlideUpPanel({ children, onPanelClose, closeText, confirmText, title }) {
    // Grab ref of panel for handling tabbing
    const panelRef = React.useRef();

    const keystrokeHandlers = React.useMemo(() => ({
        // Tab Key
        9: handleTabPress,
        // Escape Key
        27: onPanelClose
    }), [onPanelClose]);

    // Lock scrolling
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';

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

    return createPortal(
        <>
            <div className={styles.lockedBackground} onClick={onPanelClose} />
            <div ref={panelRef}
                 aria-modal
                 role='dialog'
                 className={styles.panelContainer}
                 onClick={event => event.stopPropagation()}
            >
                <div className={styles.titleTag}>
                    <h2 tabIndex={0} className={styles.title}>
                        {title}
                    </h2>
                </div>
                <div className={styles.panelContent}>
                    <div className={styles.scrollableArea}>
                        { children }
                    </div>
                    <div className={styles.buttonRow}>
                        <button className={styles.buttons}>
                            Push Me
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}