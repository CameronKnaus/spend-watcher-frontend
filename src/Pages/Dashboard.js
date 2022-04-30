import React from 'react';
import styles from '../Styles/Pages/Dashboard.module.css';
import Spending from '../Containers/Spending';
import getContent from '../Util/getContent';


export default function Dashboard() {

    return (
        <div className={styles.container}>
            <h1 className='accessible-text'>
                {getContent('ACCESSIBLE_PAGE_TITLES', 'DASHBOARD')}
            </h1>
            <Spending />
        </div>
    );
}