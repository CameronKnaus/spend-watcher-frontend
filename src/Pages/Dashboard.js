import React from 'react';
import styles from '../Styles/Pages/Dashboard.module.css';
import Spending from '../Containers/Spending';
import useContent from '../CustomHooks/useContent';
import RecentTransactions from '../Containers/RecentTransactions';


export default function Dashboard() {
    const getContent = useContent();

    return (
        <div className={styles.container}>
            <h1 className='accessible-text'>
                {getContent('ACCESSIBLE_PAGE_TITLES', 'DASHBOARD')}
            </h1>
            <Spending />
            <RecentTransactions />
        </div>
    );
}