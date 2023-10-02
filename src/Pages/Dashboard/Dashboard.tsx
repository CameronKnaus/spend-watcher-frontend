import useContent from 'CustomHooks/useContent';
import styles from './Dashboard.module.css';
import Spending from 'Containers/Spending/Spending';

export default function Dashboard() {
    const getContent = useContent('ACCESSIBLE_PAGE_TITLES');

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <h1 className='accessible-text'>
                    {getContent('DASHBOARD')}
                </h1>
                <Spending />
            </div>
        </div>
    );
}