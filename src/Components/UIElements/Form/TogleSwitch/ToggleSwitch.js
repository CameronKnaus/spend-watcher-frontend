import styles from './ToggleSwitch.module.css';

export default function ToggleSwitch({ onState, labelText, setOnState, activeColor, spaceBetween }) {
    const height = 20;
    const width = 40;

    const toggleSwitchStyle = {
        height,
        width
    };

    const sliderStyle = onState ? {
        backgroundColor: activeColor
    } : {};

    const toggleBubbleStyle = {
        transform: `translateX(${onState ? width / 2 : 0}px)`,
        height,
        width: height
    };

    const containerStyle = spaceBetween ? {
        display: 'flex',
        justifyContent: 'space-between'
    } : {
        display: 'inline-flex'
    };

    return (
        <div className={styles.toggleContainer} style={containerStyle} onClick={setOnState}>
            <div className={styles.toggleLabel}>
                {labelText}
            </div>
            <div className={styles.toggleSwitch}
                 style={toggleSwitchStyle}
            >
                <span className={styles.slider} style={sliderStyle}>
                    <span className={styles.toggleBubble} style={toggleBubbleStyle} />
                </span>
            </div>
        </div>
    );
}