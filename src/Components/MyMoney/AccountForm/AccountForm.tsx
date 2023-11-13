import React, { ChangeEvent } from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './AccountForm.module.css';
import { AccountCategoryInput } from '../../UIElements/Form/CategoryInput/CategoryInput';
import SlideUpPanel from '../../UIElements/Modal/SlideUpPanel/SlideUpPanel';
import axios from 'axios';
import MoneyInput from '../../UIElements/Form/MoneyInput/MoneyInput';
import ServiceRoutes from 'Constants/ServiceRoutes';
import formatCurrency from 'Util/Formatters/formatCurrency';
import Link from 'Components/UIElements/Navigation/Link/Link';
import MONTH_NAMES from 'Constants/MonthNames';
import dayjs from 'dayjs';
import { EmptyCallback } from 'Types/QoLTypes';
import { MoneyAccount, MoneyAccountPayload } from 'Types/AccountTypes';
import { AccountCategoryType } from 'Constants/categories';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, myMoneyDependentQueryKeys } from 'Util/QueryKeys';

type NewAccountFormProps = {
    onPanelClose: EmptyCallback;
    editMode?: false;
    existingAccount?: never;
    swapToEditBalance?: never;
};

type EditAccountFormProps = {
    onPanelClose: EmptyCallback;
    editMode: true;
    existingAccount: MoneyAccount;
    swapToEditBalance: EmptyCallback;
}

type AccountFormPropTypes = NewAccountFormProps | EditAccountFormProps;

const defaultExistingAccount: MoneyAccount = {
    accountId: '',
    accountName: '',
    currentAccountValue: 0,
    hasVariableGrowthRate: false,
    accountType: AccountCategoryType.CHECKING,
    growthRate: '0',
    requiresNewUpdate: false
};

export default function AccountForm({ onPanelClose, editMode, existingAccount = defaultExistingAccount, swapToEditBalance = () => { /* NOOP */ } }: AccountFormPropTypes) {
    const getContent = useContent('MY_MONEY');
    const queryClient = useQueryClient();

    // State for form values
    const [formValid, setFormValid] = React.useState(Boolean(existingAccount.currentAccountValue));
    const [accountName, setAccountName] = React.useState(existingAccount.accountName);
    const [category, setCategory] = React.useState<AccountCategoryType>(() => {
        const accountType = existingAccount.accountType;
        if(accountType) {
            return accountType;
        }

        // Default to checking
        return AccountCategoryType.CHECKING;
    });
    const [accountValue, setAccountValue] = React.useState<string | undefined>();
    const [growthRate, setGrowthRate] = React.useState(existingAccount.growthRate);
    const [isVariable, setIsVariable] = React.useState(existingAccount.hasVariableGrowthRate);
    const [loading, setLoading] = React.useState(false);

    // Update form validity only based on amount having a positive value
    React.useEffect(() => {
        setFormValid(Boolean(accountName.length));
    }, [accountName]);

    function submit() {
        if(loading || !formValid) {
            return;
        }

        const payload: MoneyAccountPayload = {
            accountName,
            accountCategory: category,
            startingAccountValue: Number(accountValue),
            growthRate: Number(growthRate),
            hasVariableGrowthRate: isVariable
        };

        if(editMode) {
            payload.accountId = existingAccount.accountId;
        }

        const endpoint = editMode ? ServiceRoutes.editAccount : ServiceRoutes.addNewAccount;

        // Handle service call
        axios.post(endpoint, payload)
            .then(() => {
                invalidateQueries(queryClient, myMoneyDependentQueryKeys);
            })
            .finally(() => setLoading(false));
    }

    function updateGrowthRate(event: ChangeEvent<HTMLInputElement>) {
        const rate = event.target.value;
        // Prevent decimals precision higher than 2
        const growthRate = rate.indexOf('.') >= 0 ? rate.substr(0, rate.indexOf('.')) + rate.substr(rate.indexOf('.'), 3) : rate;
        setGrowthRate(growthRate);
    }

    const VARIABLE_GROWTH_LABEL = getContent('VARIABLE_GROWTH_LABEL');
    const VARIABLE_GROWTH_DESCRIPTION = getContent('VARIABLE_GROWTH_DESCRIPTION');
    return (
        <SlideUpPanel title={getContent(editMode ? 'EDIT_ACCOUNT' : 'NEW_ACCOUNT')}
                      closeText={getContent('CANCEL')}
                      confirmText={getContent(editMode ? 'EDIT' : 'SUBMIT')}
                      disableConfirmButton={!formValid}
                      forwardActionCallback={submit}
                      tagColor='var(--theme-celadon-blue)'
                      onPanelClose={onPanelClose}
        >
            <form className={styles.transactionForm}>
                {/* ACCOUNT NAME */}
                <label>
                    {getContent('NAME_LABEL')}
                    <input type='text'
                           className={styles.textInput}
                           placeholder={getContent('NAME_PLACEHOLDER')}
                           value={accountName}
                           autoComplete='off'
                           maxLength={50}
                           onChange={(event) => setAccountName(event.target.value)}
                    />
                </label>
                {/* ACCOUNT CATEGORY */}
                <label htmlFor='category-input' style={{ width: 100 }}>
                    {getContent('CATEGORY_LABEL')}
                </label>
                <AccountCategoryInput textInputStyles={styles.textInput}
                                      value={category}
                                      onChange={setCategory}
                />
                {/* ACCOUNT VALUE */}
                {editMode ? (
                    <>
                        <label>
                            {getContent('ACCOUNT_VALUE_LABEL')}
                        </label>
                        <div className={styles.accountValue}>
                            {formatCurrency(existingAccount.currentAccountValue)}
                        </div>
                        <Link text={getContent('EDIT_ACCOUNT_BALANCE_LABEL', [MONTH_NAMES[dayjs().month()]])}
                              customClass={styles.editAccountBalanceLink}
                              textAlign='center'
                              onClickCallback={swapToEditBalance}
                        />
                    </>
                    ) : (
                        <label>
                            {getContent('ACCOUNT_VALUE_LABEL')}
                            <MoneyInput name='account-value-spent-field'
                                        placeholder={getContent('ACCOUNT_VALUE_PLACEHOLDER')}
                                        className={styles.textInput}
                                        stateUpdater={setAccountValue}
                                        value={accountValue}
                            />
                        </label>
                    )}
                {/* GROWTH RATE */}
                <label>
                    {getContent('GROWTH_RATE_LABEL')}
                    <input type='number'
                           className={styles.textInput}
                           placeholder={getContent('GROWTH_RATE_PLACEHOLDER')}
                           value={growthRate}
                           autoComplete='off'
                           step='.01'
                           onChange={updateGrowthRate}
                    />
                </label>
                {/* VARIABLE GROWTH RATE */}
                <div className={styles.checkContainer}>
                    <input type='checkbox'
                           aria-label={`${VARIABLE_GROWTH_LABEL},${VARIABLE_GROWTH_DESCRIPTION}`}
                           className={styles.checkBox}
                           checked={isVariable}
                           onChange={() => setIsVariable(prev => !prev)}
                    />
                    <div aria-hidden className={styles.checkLabel}>
                        {VARIABLE_GROWTH_LABEL}
                    </div>
                    <div aria-hidden className={styles.checkDescription}>
                        {VARIABLE_GROWTH_DESCRIPTION}
                    </div>
                </div>
            </form>
        </SlideUpPanel>
    );
}