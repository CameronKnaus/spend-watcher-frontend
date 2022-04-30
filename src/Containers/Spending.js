import React from 'react';
import styles from '../Styles/Containers/Spending.module.css';
import getContent from '../Util/getContent';

export default function Spending() {
    return (
        <h2 className={`header-text ${styles.title}`}>
            {getContent('SPENDING', 'MY_SPENDING')}
        </h2>
    );
}