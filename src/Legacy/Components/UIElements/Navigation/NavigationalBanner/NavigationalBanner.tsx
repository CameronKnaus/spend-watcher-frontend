import { CgChevronLeft } from 'react-icons/cg';
import styles from './NavigationalBanner.module.css';
import { useNavigate } from 'react-router';

type NavigationalBannerPropTypes = {
    title: string;
}

export default function NavigationalBanner({ title }: NavigationalBannerPropTypes) {
    const navigate = useNavigate();

    return (
        <div className={styles.banner}>
            <div className={styles.backArrow} onClick={() => navigate(-1)}>
                <CgChevronLeft />
            </div>
            <h1 className={styles.titleText}>
                { title }
            </h1>
        </div>
    );
}