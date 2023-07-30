import React from 'react';
import styles from './MyMoney.module.css';
import useContent from 'CustomHooks/useContent';
import ActionTile from 'Components/Tiles/ActionTile/ActionTile';
import Link from 'Components/UIElements/Navigation/Link/Link';
import AccountForm from 'Components/MyMoney/AccountForm/AccountForm';
import useFetch from '../../CustomHooks/useFetch';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import AccountsList from 'Components/Accounts/AccountsList/AccountsList';
import formatCurrency from 'Util/Formatters/formatCurrency';

export default function MyMoney({ refreshRequested, callForRefresh }) {
    const [newAccountPanelOpen, setNewAccountPanelOpen] = React.useState(false);
    const getContent = useContent('MY_MONEY');

    const service = useFetch(SERVICE_ROUTES.accountsSummary, true);

    React.useEffect(() => {
        if(refreshRequested) {
            service.fire(true);
        }
    }, [refreshRequested, service]);


    if(service.error) {
        return JSON.stringify(service.error);
    }

    return (
        <div className={styles.myMoneyContainer}>
            <h2 className={`header-text ${styles.title}`}>
                {getContent('MY_MONEY')}
            </h2>
            <ActionTile useShadow
                        isLoading={service.loading}
                        title={getContent('TOTAL_VALUE_TITLE')}
                        value={formatCurrency(service?.response?.totalEquity)}
                        ariaValue={getContent('TOTAL_VALUE_ARIA', [0])}
                        actionPrompt={getContent('SEE_TRENDS')}
                        options={{ showValueAbove: true, valueColor: 'var(--theme-money-gain)' }}
            />
            <AccountsList listOfAccounts={service?.response?.accountsList} isLoading={service.loading} onEditCallback={callForRefresh} />
            <Link useChevron
                  text={getContent('ADD_ACCOUNT')}
                  textAlign='center'
                  customClass={styles.linkContainer}
                  onClickCallback={() => setNewAccountPanelOpen(true)}
            />
            {
                newAccountPanelOpen && <AccountForm onPanelClose={() => setNewAccountPanelOpen(false)} onSubmission={callForRefresh} />
            }
        </div>
    );
}