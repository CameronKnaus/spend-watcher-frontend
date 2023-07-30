import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Spending from 'Containers/Spending/Spending';
import useContent from 'CustomHooks/useContent';
import RecentTransactions from 'Containers/RecentTransactions/RecentTransactions';
import MyMoney from 'Containers/MyMoney/MyMoney';
import Trips from 'Containers/Trips/Trips';
import useTripDetails from 'CustomHooks/useTripDetails';
import { invalidateAllDependentQueries } from 'Util/QueryKeys';
import { useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
    const getContent = useContent();
    const [refreshRequested, setRefreshRequested] = useState(false);
    const { refreshTrips } = useTripDetails();
    const queryClient = useQueryClient();

    useEffect(() => {
        // refreshRequested is used to trigger services on the dashboard to be called once more
        // We can immediately set it to false after use.
        if(refreshRequested) {
            setRefreshRequested(false);
        }
    }, [refreshRequested]);

    function callForRefresh() {
        invalidateAllDependentQueries(queryClient);
        setRefreshRequested(true);
        refreshTrips(true);
    }

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <h1 className='accessible-text'>
                    {getContent('ACCESSIBLE_PAGE_TITLES', 'DASHBOARD')}
                </h1>
                <Spending refreshRequested={refreshRequested} callForRefresh={callForRefresh} />
                <RecentTransactions refreshRequested={refreshRequested} callForRefresh={callForRefresh} />
                <Trips refreshRequested={refreshRequested} callForRefresh={callForRefresh} />
                <MyMoney refreshRequested={refreshRequested} callForRefresh={callForRefresh} />
            </div>
        </div>
    );
}