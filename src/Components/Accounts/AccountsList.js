import InteractiveDataRow from 'Components/UIElements/InteractiveDataRow';
import useContent from 'CustomHooks/useContent';
import styles from 'Styles/Components/Accounts/AccountsList.module.css';
import MONTH_NAMES from 'Constants/MonthNames';
import dayjs from 'dayjs';
import { FaPencilAlt } from 'react-icons/fa';
import { useState } from 'react';
import AccountForm from 'Components/MyMoney/AccountForm';
import AccountBalanceUpdateForm from 'Components/MyMoney/AccountBalanceUpdateForm';
import LoadingInteractiveRowList from 'Components/UIElements/Loading/LoadingInteractiveRowList';

export default function AccountsList({ listOfAccounts, onEditCallback = () => { /* NOOP */ }, isLoading }) {
    const getContent = useContent();
    const [accountToEdit, setAccountToEdit] = useState(null);
    const [accountToUpdate, setAccountToUpdate] = useState(null);
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
                    let description = getContent('ACCOUNT_CATEGORIES', accountType);
                    if(growthRate) {
                        const variability = hasVariableGrowthRate ? getContent('MY_MONEY', 'VARIABLE_RATE') : getContent('MY_MONEY', 'FIXED_RATE');
                        description += ` - ${growthRate}% ${variability}`;
                    }

                    return (
                        <div key={accountInfo.accountId} className={styles.rowContainer}>
                            <InteractiveDataRow title={accountInfo.accountName}
                                                amount={accountInfo.currentAccountValue}
                                                iconCategory={accountType}
                                                description={description}
                                                amountDescription={getContent('MY_MONEY', 'AS_OF', [accountInfo.lastUpdated])}
                                                onClick={() => setAccountToEdit(accountInfo)}
                            />
                            {
                                accountInfo.requiresNewUpdate && (
                                    <button className={styles.updateButton} onClick={() => setAccountToUpdate(accountInfo)}>
                                        <div className={styles.editIcon}>
                                            <FaPencilAlt />
                                        </div>
                                        {getContent('MY_MONEY', 'UPDATE_FOR_MONTH', [MONTH_NAMES[dayjs().month()]])}
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
                                 onSubmission={onEditCallback}
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
                                              onSubmission={onEditCallback}
                    />
                )
            }
        </>
    );
}