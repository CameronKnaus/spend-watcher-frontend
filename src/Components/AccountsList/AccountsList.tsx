import Currency from 'Components/Currency/Currency';
import InteractiveRow from 'Components/InteractiveRow/InteractiveRow';
import LoadingInteractiveRow from 'Components/InteractiveRow/LoadingInteractiveRow';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import AccountCategoryIcon from 'Components/Shared/Icons/AccountCategoryIcon';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import useAccountSummaryService from 'Hooks/useAccountSummaryService/useAccountSummaryService';
import useContent from 'Hooks/useContent';
import { formatMonthYearDBDateAsReadable } from 'Util/Formatters/dateFormatters/dateFormatters';
import styles from './AccountsList.module.css';

export default function AccountsList() {
    const { isLoading, accountsSummary } = useAccountSummaryService();
    const getCategoryLabel = useContent('ACCOUNT_CATEGORIES');
    const getContent = useContent('accounts');

    return (
        <ModuleContainer heading={getContent('accountsList')}>
            <div className={styles.totalAmount}>
                {isLoading ? (
                    <SkeletonLoader className={styles.totalSkeleton} />
                ) : (
                    <Currency amount={accountsSummary!.totalEquity} />
                )}
            </div>
            <div className={styles.accountsList}>
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <LoadingInteractiveRow key={`account-loading-${index}`} />
                      ))
                    : accountsSummary?.accountsList.map((account) => (
                          <InteractiveRow
                              key={`account--row-${account.id}`}
                              icon={<AccountCategoryIcon category={account.category} size={36} />}
                              primaryLabel={account.name}
                              primaryDataPoint={<Currency amount={account.currentAccountValue} />}
                              secondaryLabel={getCategoryLabel(account.category)}
                              secondaryDataPoint={getContent('asOf', [
                                  formatMonthYearDBDateAsReadable(account.lastUpdated),
                              ])}
                          />
                      ))}
            </div>
        </ModuleContainer>
    );
}
