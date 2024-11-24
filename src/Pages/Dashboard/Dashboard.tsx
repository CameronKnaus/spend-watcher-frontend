import AccountsList from 'Components/AccountsList/AccountsList';
import AddAccountButton from 'Components/AddAccountButton/AddAccountButton';
import LogSpendButton from 'Components/LogSpendButton';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import PageContainer from 'Components/PageContainer/PageContainer';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import styles from './Dashboard.module.css';
import RecentTransactions from './RecentTransactions';
import SummaryTotals from './SummaryTotals/SummaryTotals';
import TopDiscretionaryCategories from './TopDiscretionaryCategories';

export default function Dashboard() {
    const getContent = useContent('dashboard');
    const currentMonth = format(new Date(), 'LLLL');
    const pageTitle = getContent('monthOverview', [currentMonth]);

    return (
        <PageContainer pageTitle={pageTitle} className={styles.dashboard}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        <SummaryTotals />
                        {/* Top categories */}
                        <ModuleContainer
                            heading={getContent('topCategories')}
                            className={styles.summaryTile}
                            elevation="low"
                        >
                            <TopDiscretionaryCategories />
                        </ModuleContainer>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <LogSpendButton />
                    <RecentTransactions />
                    <AccountsList />
                    <AddAccountButton />
                </div>
            </div>
        </PageContainer>
    );
}
