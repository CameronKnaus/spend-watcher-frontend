import styles from './CategoryIcon.module.css';
import CATEGORIES, { AnyCategoryCode } from 'Constants/categories';
import { MdRefresh } from 'react-icons/md';
import { SizeValue } from 'Types/StyleTypes';

type CategoryIconPropTypes = {
    categoryCode: AnyCategoryCode,
    containerSize: SizeValue,
    iconSize: SizeValue,
    customClasses?: string,
    showRevolvingIcon?: boolean
}

export default function CategoryIcon({
    categoryCode,
    containerSize,
    iconSize,
    customClasses,
    showRevolvingIcon
}: CategoryIconPropTypes) {
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
            {
                showRevolvingIcon ? (
                    <>
                        <div className={styles.iconPlacement}>
                            {CATEGORIES[categoryCode].icon}
                        </div>
                        <div className={styles.revolvingIcon} style={{ animationDelay: `${(Math.random() * 8).toFixed(2)}s` }}>
                            <MdRefresh />
                        </div>
                    </>
                ) :
                    CATEGORIES[categoryCode].icon
            }
        </div>
    );
}