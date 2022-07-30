import React from 'react';
import { CgChevronLeft } from 'react-icons/cg';
import styles from 'Styles/Components/UIElements/Navigation/NavigationalBanner.module.css';
import { useNavigate } from 'react-router';

export default function NavigationalBanner({ title }) {
    const navigate = useNavigate();

    return (
        <div className={styles.banner}>
            <div className={styles.backArrow} onClick={() => navigate(-1)}>
                <CgChevronLeft />
            </div>
            <div className={styles.titleText}>
                { title }
            </div>
        </div>
    );
}