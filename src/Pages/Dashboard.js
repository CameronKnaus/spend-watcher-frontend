import React from 'react';
import styles from '../Styles/Pages/Dashboard.module.css';
import Spending from '../Containers/Spending';
import useContent from '../CustomHooks/useContent';
import RecentTransactions from '../Containers/RecentTransactions';
// import MyMoney from '../Containers/MyMoney';


export default function Dashboard() {
    const getContent = useContent();
    const [refreshRequested, setRefreshRequested] = React.useState(false);

    React.useEffect(() => {
        // refreshRequested is used to trigger services on the dashboard to be called once more
        // We can immediately set it to false after use.
        if(refreshRequested) {
            setRefreshRequested(false);
        }
    }, [refreshRequested]);

    function callForRefresh() {
        setRefreshRequested(true);
    }

    return (
        <div className={styles.container}>
            <h1 className='accessible-text'>
                {getContent('ACCESSIBLE_PAGE_TITLES', 'DASHBOARD')}
            </h1>
            <Spending refreshRequested={refreshRequested} callForRefresh={callForRefresh} />
            <RecentTransactions refreshRequested={refreshRequested} callForRefresh={callForRefresh} />
            {/* <MyMoney /> */}
        </div>
    );
}