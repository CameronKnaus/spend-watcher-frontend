import styles from './Alert.module.css';
import { MdInfoOutline } from 'react-icons/md';

const SIZE_CONFIG = {
    base: {
        container: styles.baseContainer,
        icon: styles.baseIcon
    },
    small: {
        container: styles.smallContainer,
        icon: styles.smallIcon
    }
};

export default function Alert({ alertText, size = 'base', color = 'var(--theme-red)' }) {
    const containerSize = SIZE_CONFIG[size];

    if(!containerSize) {
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