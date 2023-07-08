import React from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './AccountBalanceUpdateForm.module.css';
import SlideUpPanel from '../../UIElements/Modal/SlideUpPanel/SlideUpPanel';
import axios from 'axios';
import MoneyInput from 'Components/UIElements/Form/MoneyInput/MoneyInput';
import MONTH_NAMES from 'Constants/MonthNames';
import dayjs from 'dayjs';
import CategoryIcon from 'Components/UIElements/VisualOnlyElements/CategoryIcon/CategoryIcon';
import formatCurrency from 'Util/formatCurrency';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';

export default function AccountBalanceUpdateForm({ onPanelClose, onSubmission, accountToUpdate = {}, editMode }) {
    const getContent = useContent();
    const text = (key, args) => getContent('MY_MONEY', key, args);

    // State for form values
    const [accountValue, setAccountValue] = React.useState(null);

    function submit() {
        if(accountValue == null) {
            return;
        }

        const payload = {
            accountId: accountToUpdate.accountId,
            accountValue: Number(accountValue),
            isRevision: Boolean(editMode)
        };

        // Handle service call
        axios.post(SERVICE_ROUTES.updateAccountBalance, payload).then(onSubmission);
    }

    const valueChange = accountValue - accountToUpdate.currentAccountValue;
    const valueChangePercentage = ((valueChange / accountToUpdate.currentAccountValue) * 100).toFixed(2);
    const isGain = valueChange > 0;
    const changeSign = isGain ? '+' : '';
    const valueMatchesOriginal = !accountValue || Number(accountValue) === accountToUpdate.currentAccountValue;
    const valueChangeStyle = valueMatchesOriginal ? {} : { color: isGain ? 'var(--theme-money-gain)' : 'var(--theme-money-loss)' };

    return (
        <SlideUpPanel title={text('UPDATE_BALANCE')}
                      closeText={text('CANCEL')}
                      confirmText={text('SUBMIT')}
                      forwardActionCallback={submit}
                      tagColor='var(--theme-jungle-green)'
                      disableConfirmButton={accountValue == null}
                      onPanelClose={onPanelClose}
        >
            <form className={styles.balanceUpdateForm}>
                <div className={styles.accountSummary}>
                    <CategoryIcon categoryCode={accountToUpdate.accountType}
                                  containerSize='56px'
                                  iconSize='33px'
                                  customClasses={styles.iconContainer}
                    />
                    <div className={styles.accountDetailsContainer}>
                        <div className={styles.accountNameLabel}>
                            {accountToUpdate.accountName}
                        </div>
                        <div className={styles.accountValueLabel}>
                            {formatCurrency(accountToUpdate.currentAccountValue)}
                        </div>
                        <div className={styles.asOfLabel}>
                            {`(${text('AS_OF', [accountToUpdate.lastUpdated])})`}
                        </div>
                    </div>
                </div>
                <label>
                    {text('VALUE_CHANGE_LABEL')}
                </label>
                <div style={valueChangeStyle} className={styles.valueChange}>
                    {
                        valueMatchesOriginal ?
                            '$0.00 (0.00%)'
                         :
                            changeSign + formatCurrency(valueChange) + ` (${changeSign + valueChangePercentage}%)`

                    }

                </div>
                <label>
                    <div className={styles.updateLabel}>
                        {text('ACCOUNT_VALUE_UPDATE_LABEL', [MONTH_NAMES[dayjs().month()]])}
                    </div>
                    <MoneyInput name='account-value-spent-field'
                                placeholder={text('ACCOUNT_VALUE_PLACEHOLDER')}
                                className={styles.textInput}
                                stateUpdater={setAccountValue}
                                value={accountValue}
                    />
                </label>
            </form>
        </SlideUpPanel>
    );
}