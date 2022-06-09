import React from 'react';
import styles from '../../Styles/Components/UIElements/CategoryIcon.module.css';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../Constants/transactionConstants';

export default function CategoryIcon({ categoryCode, containerSize, iconSize, customClasses }) {
    const containerStyle = {
        height: containerSize,
        width: containerSize,
        backgroundColor: CATEGORY_COLORS[categoryCode],
        fontSize: iconSize
    };

    return (
        <div className={`${styles.iconContainer} ${customClasses}`}
             style={containerStyle}
        >
            {CATEGORY_ICONS[categoryCode]}
        </div>
    );
}