import React from 'react';
import styles from 'Styles/Components/Tiles/ActionTile.module.css';
import { CgChevronRight } from 'react-icons/cg';

/* Params:
*   title - string - required
*   subtitle - string - optional
*   value - string - optional - if falsy only the title and fallbackActionPrompt will be displayed
*   fallbackActionPrompt - string - required if !value
*   fallbackDescription - string - optional - adds extra description and only shows when value is falsy
*   ariaValue - string - optional - alternative value for screen readers to read for value
*   actionPrompt - string - required
*   useShadow - boolean - default: false
*   callback - function - required
*   options: {
*       showValueAbove: boolean - default: false
*       valueColor: string - CSS color to set value text to - default: '#333333'
*       minWidth: number|string - sets minimum width of container - default: 0
*       maxWidth: number|string - sets maximum width of container - default: 'none'
*       paddingBelow: number|string - sets padding-bottom - default: 24
*   }
*/
const defaultOptions = {
    showValueAbove: false,
    valueColor: '#333333',
    minWidth: 0,
    maxWidth: 'none',
    paddingBelow: 24
};
function ActionTile({ title, subtitle, value, fallbackActionPrompt, fallbackDescription, ariaValue, actionPrompt, useShadow, callback, options }) {
    const args = Object.assign({}, defaultOptions, options);

    const { minWidth, maxWidth, paddingBelow } = args;
    const container = (children) => (
        <div style={{ paddingBottom: paddingBelow }}>
            <button className={`${styles.container} ${useShadow ? 'high-shadow' : ''}`}
                    style={{ minWidth, maxWidth }}
                    onClick={callback}
            >
                {children}
            </button>
        </div>
    );

    const Title = React.useCallback(({ extraSpace, hideFromScreenReader, hideFromScreen }) => (
        <div aria-hidden={hideFromScreenReader}
             className={`${styles.title} ${hideFromScreen ? 'accessible-text' : '' } ${extraSpace ? styles.pb12 : styles.pb8}`}
        >
            {title}
        </div>
    ), [title]);

    if(!value && value !== 0) {
        return container(
            <div className={styles.flexContainer}>
                <div className={styles.descriptionContainer}>
                    <Title />
                    {
                        fallbackDescription && (
                            <div className={`${styles.subtitle} ${styles.pb12}`}>
                                {fallbackDescription}
                            </div>
                        )
                    }
                    <div className={styles.actionPrompt}>
                        {fallbackActionPrompt}
                    </div>
                </div>
                <CgChevronRight className={styles.chevron} />
            </div>
        );
    }

    if(args.showValueAbove) {
        return container(
            <>
                {/* Accessible header */}
                <Title hideFromScreen />
                <div aria-label={ariaValue || value}
                     className={`${styles.centeredValue} ${styles.pb12}`}
                     style={{ color: args.valueColor }}
                >
                    {value}
                </div>
                <Title hideFromScreenReader />
                {
                    subtitle && (
                        <div className={`${styles.subtitle} ${styles.pb12}`}>
                            {subtitle}
                        </div>
                    )
                }
                <div className={styles.actionPrompt}>
                    {actionPrompt}
                </div>
            </>
        );
    }

    if(subtitle) {
        return container(
            <>
                <Title extraSpace />
                <div className={styles.flexContainer}>
                    <div className={styles.descriptionContainer}>
                        <div className={styles.subtitle}>
                            {subtitle}
                        </div>
                        <div aria-hidden
                             className={styles.actionPrompt}
                        >
                            {actionPrompt}
                        </div>
                    </div>
                    <div aria-label={ariaValue || value}
                         className={styles.valueContainer}
                         style={{ color: args.valueColor }}
                    >
                        {value}
                    </div>
                    <div className='accessible-text'>
                        {actionPrompt}
                    </div>
                </div>
            </>
        );
    }

    return container(
        <div className={styles.flexContainer}>
            <div className={styles.descriptionContainer}>
                <Title />
                <div aria-hidden
                     className={styles.actionPrompt}
                >
                    {actionPrompt}
                </div>
            </div>
            <div aria-label={ariaValue || value}
                 className={styles.valueContainer}
                 style={{ color: args.valueColor }}
            >
                {value}
            </div>
            <div className='accessible-text'>
                {actionPrompt}
            </div>
        </div>
    );
}

export default ActionTile;