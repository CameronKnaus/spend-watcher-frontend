import AccountsNeedUpdateBanner from 'Components/AccountsNeedUpdateBanner/AccountsNeedUpdateBanner';
import PageContainer from 'Components/PageContainer/PageContainer';
import RecurringSpendNeedsUpdateBanner from 'Components/RecurringSpendNeedsUpdateBanner/RecurringSpendNeedsUpdateBanner';
import useContent from 'Hooks/useContent';
import { useIsMobile } from 'Util/IsMobileContext';
import styles from './Trends.module.css';
import TrendsMobileNavigation from './TrendsMobileNavigation/TrendsMobileNavigation';

export default function Trends() {
    const getContent = useContent('trends');
    const isMobile = useIsMobile();

    return (
        <PageContainer pageTitle={getContent('pageTitle')} className={styles.pageContainer}>
            {isMobile && <TrendsMobileNavigation />}
            <AccountsNeedUpdateBanner />
            <RecurringSpendNeedsUpdateBanner />
        </PageContainer>
    );
}
