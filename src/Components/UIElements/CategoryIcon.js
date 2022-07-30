import React from 'react';
import styles from '../../Styles/Components/UIElements/CategoryIcon.module.css';
import CATEGORIES from '../../Constants/categories';

export default function CategoryIcon({ categoryCode, containerSize, iconSize, customClasses }) {
    if(!CATEGORIES[categoryCode]) {
        return null;
    }

    const containerStyle = {
        height: containerSize,
        width: containerSize,
        backgroundColor: CATEGORIES[categoryCode].color,
        fontSize: iconSize
    };

    return (
        <div className={`${styles.iconContainer} ${customClasses}`}
             style={containerStyle}
        >
            {CATEGORIES[categoryCode].icon}
        </div>
    );
}