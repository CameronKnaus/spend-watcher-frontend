import React from 'react';
import useContent from '../../CustomHooks/useContent';
import styles from '../../Styles/Components/Transactions/TransactionForm.module.css';
import MoneyInput from '../FormElements/MoneyInput';
import CategoryInput from '../FormElements/CategoryInput';
import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';

export default function TransactionForm() {
    const [amount, setAmount] = React.useState();
    const [category, setCategory] = React.useState();
    const [isUncommon, setIsUncommon] = React.useState(false);
    const [note, setNote] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(dayjs());

    const getContent = useContent();
    const text = (key, args) => getContent('TRANSACTIONS', key, args);

    const UNCOMMON_LABEL = text('UNCOMMON_LABEL');
    const UNCOMMON_DESCRIPTION = text('UNCOMMON_DESCRIPTION');
    return (
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
    );
}