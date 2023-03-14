import styles from '../../../Styles/Components/UIElements/Informational/Alert.module.css';
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

export default function Alert({ alertText, size = 'base' }) {
    const containerSize = SIZE_CONFIG[size];

    if(!containerSize) {
        return null;
    }

    return (
        <div className={`${styles.alertContainer} ${containerSize.container}`}>
            <div className={`${styles.alertIcon} ${containerSize.icon}`}>
                <MdInfoOutline />
            </div>
            {alertText}
        </div>
    );
}