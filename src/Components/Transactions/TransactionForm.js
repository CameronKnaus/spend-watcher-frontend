import React from 'react';
import useContent from '../../CustomHooks/useContent';
import styles from '../../Styles/Components/Transactions/TransactionForm.module.css';
import MoneyInput from '../FormElements/MoneyInput';
import CategoryInput from '../FormElements/CategoryInput';
import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import SlideUpPanel from '../UIElements/SlideUpPanel';
import SERVICE_ROUTES from '../../Constants/ServiceRoutes';
import axios from 'axios';

// existingTransaction should be an object containing all transaction keys
export default function TransactionForm({ onPanelClose, onSubmission, editMode, existingTransaction = {} }) {
    const getContent = useContent();
    const text = (key, args) => getContent('TRANSACTIONS', key, args);

    // State for form values
    const [formValid, setFormValid] = React.useState(Boolean(existingTransaction.amount)); // defaults false
    const [amount, setAmount] = React.useState(existingTransaction.amount || null);
    const [category, setCategory] = React.useState(existingTransaction.category || { code: 'OTHER', name: getContent('CATEGORIES', 'OTHER') });
    const [isUncommon, setIsUncommon] = React.useState(Boolean(existingTransaction.isUncommon));
    const [note, setNote] = React.useState(existingTransaction.note || '');
    const [selectedDate, setSelectedDate] = React.useState(existingTransaction.date ? dayjs(existingTransaction.date) : dayjs()); // defaults to today
    const [loading, setLoading] = React.useState(false);

    // Update form validity only based on amount having a positive value
    React.useEffect(() => {
        setFormValid(amount > 0);
    }, [amount]);


    function submitNewTransaction() {
        if(loading) {
            return;
        }

        setLoading(true);
        axios
            .post(SERVICE_ROUTES.submitNewTransaction, {
                amount: parseFloat(amount),
                category: (category && category.code) || 'OTHER',
                isUncommon,
                note,
                selectedDate: selectedDate.format('YYYY-MM-DD')
            })
            .then(onSubmission)
            .finally(() => setLoading(false));
    }

    function submitTransactionEdit() {
        if(loading) {
            return;
        }

        setLoading(true);
        axios
            .post(SERVICE_ROUTES.submitEditTransaction, {
                transactionId: existingTransaction.id,
                amount: parseFloat(amount),
                category: (category && category.code) || 'OTHER',
                isUncommon,
                note,
                selectedDate: selectedDate.format('YYYY-MM-DD')
            })
            .then(onSubmission)
            .finally(() => setLoading(false));
    }

    const UNCOMMON_LABEL = text('UNCOMMON_LABEL');
    const UNCOMMON_DESCRIPTION = text('UNCOMMON_DESCRIPTION');
    return (
        <SlideUpPanel title={getContent('TRANSACTIONS', editMode ? 'EDIT_EXPENSE' : 'NEW_EXPENSE')}
                      closeText={getContent('TRANSACTIONS', 'CANCEL')}
                      confirmText={getContent('TRANSACTIONS', editMode ? 'EDIT' : 'SUBMIT')}
                      disableConfirmButton={!formValid}
                      forwardActionCallback={editMode ? submitTransactionEdit : submitNewTransaction}
                      onPanelClose={onPanelClose}
        >
            <form className={styles.transactionForm}>
                <label>
                    {text('AMOUNT_LABEL')}
                    <MoneyInput name='amount-spent-field'
                                placeholder={text('AMOUNT_PLACEHOLDER')}
                                className={styles.textInput}
                                stateUpdater={setAmount}
                                value={amount}
                    />
                </label>
                <label htmlFor='category-input' style={{ width: 100 }}>
                    {text('CATEGORY_LABEL')}
                </label>
                <CategoryInput textInputStyles={styles.textInput}
                               value={category}
                               onChange={setCategory}
                />
                <label>
                    {text('NOTES_LABEL')}
                    <input type='text'
                           className={styles.textInput}
                           placeholder={text('NOTES_PLACEHOLDER')}
                           value={note}
                           autoComplete='off'
                           maxLength={60}
                           onChange={(event) => setNote(event.target.value)}
                    />
                </label>
                <div className={styles.checkContainer}>
                    <input type='checkbox'
                           aria-label={`${UNCOMMON_LABEL},${UNCOMMON_DESCRIPTION}`}
                           className={styles.checkBox}
                           checked={isUncommon}
                           onChange={() => setIsUncommon(prev => !prev)}
                    />
                    <div aria-hidden className={styles.checkLabel}>
                        {UNCOMMON_LABEL}
                    </div>
                    <div aria-hidden className={styles.checkDescription}>
                        {UNCOMMON_DESCRIPTION}
                    </div>
                </div>
                <label htmlFor='date-input'>
                    {text('DATE_LABEL')}
                </label>
                <DatePicker autoOk
                            disableFuture
                            disableToolbar
                            openTo='date'
                            format='MMMM D, YYYY'
                            value={selectedDate}
                            variant='modal'
                            className={styles.textInput}
                            onChange={setSelectedDate}
                />
            </form>
        </SlideUpPanel>
    );
}