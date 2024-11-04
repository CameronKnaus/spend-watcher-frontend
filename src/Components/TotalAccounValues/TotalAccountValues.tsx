import Currency from 'Components/Currency/Currency';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import useAccountSummaryService from 'Hooks/useAccountSummaryService/useAccountSummaryService';
import useContent from 'Hooks/useContent';
import styles from './TotalAccountValues.module.css';

export default function TotalAccountValues() {
    const getContent = useContent('accounts');
    const { isLoading, accountsSummary } = useAccountSummaryService();

    return (
        <ModuleContainer heading={getContent('totalAccountValues')}>
            {isLoading ? (
                <SkeletonLoader className={styles.skeleton} />
            ) : (
                <div className={styles.amount}>
                    <Currency amount={accountsSummary?.totalEquity} />
                </div>
            )}
        </ModuleContainer>
    );
}
