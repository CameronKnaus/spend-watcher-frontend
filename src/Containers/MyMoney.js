import React from 'react';
import styles from 'Styles/Containers/MyMoney.module.css';
import useContent from 'CustomHooks/useContent';
import ActionTile from 'Components/Tiles/ActionTile';
import Link from 'Components/UIElements/Navigation/Link';
import AccountForm from 'Components/MyMoney/AccountForm';
import useFetch from '../CustomHooks/useFetch';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import AccountsList from 'Components/Accounts/AccountsList';
import formatCurrency from 'Util/formatCurrency';

export default function MyMoney({ refreshRequested, callForRefresh }) {
    const [newAccountPanelOpen, setNewAccountPanelOpen] = React.useState(false);
    const getContent = useContent('MY_MONEY');

    const service = useFetch(SERVICE_ROUTES.accountsSummary, true);

    React.useEffect(() => {
        if(refreshRequested) {
            service.fire(true);
        }
    }, [refreshRequested, service]);

    if(service.loading) {
        return 'LOADING';
    }

    if(service.error) {
        return JSON.stringify(service.error);
    }

    return (
        <>
            <h2 className={`header-text ${styles.title}`}>
                {getContent('MY_MONEY')}
            </h2>
            <ActionTile useShadow
                        title={getContent('TOTAL_VALUE_TITLE')}
                        value={formatCurrency(service.response.totalEquity)}
                        ariaValue={getContent('TOTAL_VALUE_ARIA', [0])}
                        actionPrompt={getContent('SEE_TRENDS')}
                        options={{ showValueAbove: true, valueColor: 'var(--theme-money-gain)' }}
            />
            <AccountsList listOfAccounts={service.response.accountsList} onEditCallback={callForRefresh} />
            <Link useChevron
                  text={getContent('ADD_ACCOUNT')}
                  textAlign='center'
                  customClass={styles.linkContainer}
                  onClickCallback={() => setNewAccountPanelOpen(true)}
            />
            {
                newAccountPanelOpen && <AccountForm onPanelClose={() => setNewAccountPanelOpen(false)} onSubmission={callForRefresh} />
            }
        </>
    );
}