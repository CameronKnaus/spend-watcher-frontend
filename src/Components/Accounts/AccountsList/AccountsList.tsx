import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import useContent from 'CustomHooks/useContent';
import styles from './AccountsList.module.css';
import MONTH_NAMES from 'Constants/MonthNames';
import dayjs from 'dayjs';
import { FaPencilAlt } from 'react-icons/fa';
import { useState } from 'react';
import AccountForm from 'Components/MyMoney/AccountForm/AccountForm';
import AccountBalanceUpdateForm from 'Components/MyMoney/AccountBalanceUpdateForm/AccountBalanceUpdateForm';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';
import { MoneyAccount } from 'Types/AccountTypes';

type AccountsListPropTypes = {
    listOfAccounts: Array<MoneyAccount>;
    isLoading?: boolean;
}

export default function AccountsList({ listOfAccounts = [], isLoading = false }: AccountsListPropTypes) {
    const getContent = useContent('MY_MONEY');
    const getAccountCategoryContent = useContent('ACCOUNT_CATEGORIES');
    const [accountToEdit, setAccountToEdit] = useState<MoneyAccount | null>(null);
    const [accountToUpdate, setAccountToUpdate] = useState<MoneyAccount | null>(null);
    const [isBalanceEditMode, setIsBalanceEditMode] = useState(false);

    if(isLoading) {
        return <LoadingInteractiveRowList id='loading-account' rowCount={3} rowSpacing={12} />;
    }

    return (
        <>
            {
                listOfAccounts.map(accountInfo => {
                    const { accountType, growthRate, hasVariableGrowthRate } = accountInfo;

                    // Formulate description text
                    let description = getAccountCategoryContent(accountType);
                    if(growthRate) {
                        const variability = hasVariableGrowthRate ? getContent('VARIABLE_RATE') : getContent('FIXED_RATE');
                        description += ` - ${growthRate}% ${variability}`;
                    }

                    return (
                        <div key={accountInfo.accountId} className={styles.rowContainer}>
                            <InteractiveDataRow title={accountInfo.accountName}
                                                amount={accountInfo.currentAccountValue}
                                                iconCategory={accountType}
                                                description={description}
                                                amountDescription={getContent('AS_OF', [accountInfo.lastUpdated || ''])}
                                                onClick={() => setAccountToEdit(accountInfo)}
                            />
                            {
                                accountInfo.requiresNewUpdate && (
                                    <button className={styles.updateButton} onClick={() => setAccountToUpdate(accountInfo)}>
                                        <div className={styles.editIcon}>
                                            <FaPencilAlt />
                                        </div>
                                        {getContent('UPDATE_FOR_MONTH', [MONTH_NAMES[dayjs().month()]])}
                                    </button>
                                )
                            }
                        </div>
                    );
                })
            }
            {
                accountToEdit && (
                    <AccountForm editMode
                                 existingAccount={accountToEdit}
                                 swapToEditBalance={() => {
                                    setIsBalanceEditMode(true);
                                    setAccountToUpdate(accountToEdit);
                                    setAccountToEdit(null);
                                 }}
                                 onPanelClose={() => setAccountToEdit(null)}
                    />
                )
            }
            {
                accountToUpdate && (
                    <AccountBalanceUpdateForm accountToUpdate={accountToUpdate}
                                              editMode={isBalanceEditMode}
                                              onPanelClose={() => {
                                                setIsBalanceEditMode(false);
                                                setAccountToUpdate(null);
                                              }}
                    />
                )
            }
        </>
    );
}