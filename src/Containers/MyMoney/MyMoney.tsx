import React from 'react';
import styles from './MyMoney.module.css';
import useContent from 'CustomHooks/useContent';
import ActionTile from 'Components/Tiles/ActionTile/ActionTile';
import Link from 'Components/UIElements/Navigation/Link/Link';
import AccountForm from 'Components/MyMoney/AccountForm/AccountForm';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import AccountsList from 'Components/Accounts/AccountsList/AccountsList';
import formatCurrency from 'Util/Formatters/formatCurrency';
import axios from 'axios';
import msMapper from 'Util/Time/TimeMapping';
import { useQuery } from '@tanstack/react-query';
import { accountSummaryQueryKey } from 'Util/QueryKeys';
import myMoneyTransform from './myMoneyTransform';

export default function MyMoney() {
    const [newAccountPanelOpen, setNewAccountPanelOpen] = React.useState(false);
    const getContent = useContent('MY_MONEY');

    const { isLoading, isError, data: accountData, error: serviceError } = useQuery({
        queryKey: [accountSummaryQueryKey],
        staleTime: msMapper.day,
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.accountsSummary);
        },
        select: myMoneyTransform
    });

    if(isError) {
        // TODO: Implement error scenario
        return JSON.stringify(serviceError);
    }

    return (
        <div className={styles.myMoneyContainer}>
            <h2 className={`header-text ${styles.title}`}>
                {getContent('MY_MONEY')}
            </h2>
            <ActionTile useShadow
                        isLoading={isLoading}
                        title={getContent('TOTAL_VALUE_TITLE')}
                        value={formatCurrency(accountData?.totalEquity || 0)}
                        ariaValue={getContent('TOTAL_VALUE_ARIA', [0])}
                        actionPrompt={getContent('SEE_TRENDS')}
                        options={{ showValueAbove: true, valueColor: 'var(--theme-money-gain)' }}
            />
            { accountData?.accountsList && <AccountsList listOfAccounts={accountData.accountsList} isLoading={isLoading} /> }
            <Link useChevron
                  text={getContent('ADD_ACCOUNT')}
                  textAlign='center'
                  customClass={styles.linkContainer}
                  onClickCallback={() => setNewAccountPanelOpen(true)}
            />
            {
                newAccountPanelOpen && <AccountForm onPanelClose={() => setNewAccountPanelOpen(false)} />
            }
        </div>
    );
}