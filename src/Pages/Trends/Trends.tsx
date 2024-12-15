import AccountsNeedUpdateBanner from 'Components/AccountsNeedUpdateBanner/AccountsNeedUpdateBanner';
import PageContainer from 'Components/PageContainer/PageContainer';
import RecurringSpendNeedsUpdateBanner from 'Components/RecurringSpendNeedsUpdateBanner/RecurringSpendNeedsUpdateBanner';
import useContent from 'Hooks/useContent';

export default function Trends() {
    const getContent = useContent('trends');
    return (
        <PageContainer pageTitle={getContent('pageTitle')}>
            <AccountsNeedUpdateBanner />
            <RecurringSpendNeedsUpdateBanner />
        </PageContainer>
    );
}
