import React from 'react';
import useContent from 'CustomHooks/useContent';
import styles from './AccountForm.module.css';
import CategoryInput from '../../UIElements/Form/CategoryInput/CategoryInput';
import SlideUpPanel from '../../UIElements/Modal/SlideUpPanel/SlideUpPanel';
import axios from 'axios';
import MoneyInput from '../../UIElements/Form/MoneyInput/MoneyInput';
import ServiceRoutes from 'Constants/ServiceRoutes';
import formatCurrency from 'Util/formatCurrency';
import Link from 'Components/UIElements/Navigation/Link/Link';
import MONTH_NAMES from 'Constants/MonthNames';
import dayjs from 'dayjs';

// existingAccount should be an object containing all account data points for the form
export default function AccountForm({ onPanelClose, onSubmission, editMode, existingAccount = {}, swapToEditBalance = () => { /* NOOP */ } }) {
    const getContent = useContent();
    const text = (key, args) => getContent('MY_MONEY', key, args);

    // State for form values
    const [formValid, setFormValid] = React.useState(Boolean(existingAccount.currentAccountValue)); // defaults false
    const [accountName, setAccountName] = React.useState(existingAccount.accountName || '');
    const [category, setCategory] = React.useState(() => {
        const accountType = existingAccount.accountType;
        if(accountType) {
            return { code: accountType, name: getContent('ACCOUNT_CATEGORIES', accountType) };
        }

        // Default to checking
        return { code: 'CHECKING', name: getContent('ACCOUNT_CATEGORIES', 'CHECKING') };
    });
    const [accountValue, setAccountValue] = React.useState(null);
    const [growthRate, setGrowthRate] = React.useState(existingAccount.growthRate || '');
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

        const payload = {
            accountName,
            accountCategory: category.code,
            startingAccountValue: accountValue,
            growthRate: Number(growthRate),
            hasVariableGrowthRate: isVariable
        };

        if(editMode) {
            payload.accountId = existingAccount.accountId;
        }

        const endpoint = editMode ? ServiceRoutes.editAccount : ServiceRoutes.addNewAccount;

        // Handle service call
        axios.post(endpoint, payload)
            .then(onSubmission)
            .finally(() => setLoading(false));
    }

    function updateGrowthRate(event) {
        const rate = event.target.value;
        // Prevent decimals precision higher than 2
        const growthRate = rate.indexOf('.') >= 0 ? rate.substr(0, rate.indexOf('.')) + rate.substr(rate.indexOf('.'), 3) : rate;
        setGrowthRate(growthRate);
    }

    const VARIABLE_GROWTH_LABEL = text('VARIABLE_GROWTH_LABEL');
    const VARIABLE_GROWTH_DESCRIPTION = text('VARIABLE_GROWTH_DESCRIPTION');
    return (
        <SlideUpPanel title={text(editMode ? 'EDIT_ACCOUNT' : 'NEW_ACCOUNT')}
                      closeText={text('CANCEL')}
                      confirmText={text(editMode ? 'EDIT' : 'SUBMIT')}
                      disableConfirmButton={!formValid}
                      forwardActionCallback={submit}
                      tagColor='var(--theme-celadon-blue)'
                      onPanelClose={onPanelClose}
        >
            <form className={styles.transactionForm}>
                {/* ACCOUNT NAME */}
                <label>
                    {text('NAME_LABEL')}
                    <input type='text'
                           className={styles.textInput}
                           placeholder={text('NAME_PLACEHOLDER')}
                           value={accountName}
                           autoComplete='off'
                           maxLength={50}
                           onChange={(event) => setAccountName(event.target.value)}
                    />
                </label>
                {/* ACCOUNT CATEGORY */}
                <label htmlFor='category-input' style={{ width: 100 }}>
                    {text('CATEGORY_LABEL')}
                </label>
                <CategoryInput textInputStyles={styles.textInput}
                               value={category}
                               categoryType='accounts'
                               onChange={setCategory}
                />
                {/* ACCOUNT VALUE */}
                {editMode ? (
                    <>
                        <label>
                            {text('ACCOUNT_VALUE_LABEL')}
                        </label>
                        <div className={styles.accountValue}>
                            {formatCurrency(existingAccount.currentAccountValue)}
                        </div>
                        <Link text={text('EDIT_ACCOUNT_BALANCE_LABEL', [MONTH_NAMES[dayjs().month()]])}
                              customClass={styles.editAccountBalanceLink}
                              textAlign='center'
                              onClickCallback={swapToEditBalance}
                        />
                    </>
                    ) : (
                        <label>
                            {text('ACCOUNT_VALUE_LABEL')}
                            <MoneyInput name='account-value-spent-field'
                                        placeholder={text('ACCOUNT_VALUE_PLACEHOLDER')}
                                        className={styles.textInput}
                                        stateUpdater={setAccountValue}
                                        value={accountValue}
                            />
                        </label>
                    )}
                {/* GROWTH RATE */}
                <label>
                    {text('GROWTH_RATE_LABEL')}
                    <input type='number'
                           className={styles.textInput}
                           placeholder={text('GROWTH_RATE_PLACEHOLDER')}
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