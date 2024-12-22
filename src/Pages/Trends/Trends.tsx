import AccountsNeedUpdateBanner from 'Components/AccountsNeedUpdateBanner/AccountsNeedUpdateBanner';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import PageContainer from 'Components/PageContainer/PageContainer';
import RecurringSpendNeedsUpdateBanner from 'Components/RecurringSpendNeedsUpdateBanner/RecurringSpendNeedsUpdateBanner';
import TransactionsList from 'Components/TransactionsList/TransactionsList';
import useContent from 'Hooks/useContent';
import TopDiscretionaryCategories from 'Pages/Dashboard/TopDiscretionaryCategories';
import styles from './Trends.module.css';
import TrendsMobileNavigation from './TrendsMobileNavigation/TrendsMobileNavigation';

export default function Trends() {
    const getContent = useContent('trends');

    return (
        <PageContainer pageTitle={getContent('pageTitle')} className={styles.pageContainer}>
            <TrendsMobileNavigation />
            <AccountsNeedUpdateBanner />
            <RecurringSpendNeedsUpdateBanner />
            <div className={styles.contentContainer}>
                <ModuleContainer heading={getContent('topCategories')} className={styles.module} elevation="low">
                    <TopDiscretionaryCategories />
                </ModuleContainer>
                <TransactionsList />
            </div>
        </PageContainer>
    );
}
