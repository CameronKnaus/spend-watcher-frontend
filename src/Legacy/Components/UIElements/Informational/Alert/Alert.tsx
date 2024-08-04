import styles from './Alert.module.css';
import { MdInfoOutline } from 'react-icons/md';
import { Color } from 'Types/StyleTypes';

const SIZE_CONFIG = {
    base: {
        container: styles.baseContainer,
        icon: styles.baseIcon,
    },
    small: {
        container: styles.smallContainer,
        icon: styles.smallIcon,
    },
};

type AlertPropTypes = {
    alertText: string;
    size?: 'base' | 'small';
    color?: Color;
};

export default function Alert({ alertText, size = 'base', color = 'var(--theme-red)' }: AlertPropTypes) {
    const containerSize = SIZE_CONFIG[size];

    if (!containerSize) {
        return null;
    }

    return (
        <div className={`${styles.alertContainer} ${containerSize.container}`} style={{ color }}>
            <div className={`${styles.alertIcon} ${containerSize.icon}`}>
                <MdInfoOutline />
            </div>
            {alertText}
        </div>
    );
}
