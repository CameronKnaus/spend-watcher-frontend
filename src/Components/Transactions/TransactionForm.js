import React from 'react';
import useContent from '../../CustomHooks/useContent';
import styles from '../../Styles/Components/Transactions/TransactionForm.module.css';
import MoneyInput from '../FormElements/MoneyInput';
import CategoryInput from '../FormElements/CategoryInput';
import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import SlideUpPanel, { ClosePanel } from '../UIElements/SlideUpPanel';
import SERVICE_ROUTES from '../../Constants/ServiceRoutes';
import axios from 'axios';
import Link from '../UIElements/Link';
import { IoTrashSharp } from 'react-icons/io5';

const SUBMISSION_TYPES = {
    DELETE: 'DELETE',
    EDIT: 'EDIT',
    NEW: 'NEW'
};

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

    function submit(submissionType) {
        if(loading) {
            return;
        }

        // Create the payload and target endpoint based on submission type
        let endpoint, payload;
        if(submissionType === SUBMISSION_TYPES.NEW) {
            endpoint = SERVICE_ROUTES.submitNewTransaction;
            payload = {
                amount: parseFloat(amount),
                category: (category && category.code) || 'OTHER',
                isUncommon,
                note,
                selectedDate: selectedDate.format('YYYY-MM-DD')
            };
        } else if(submissionType === SUBMISSION_TYPES.EDIT) {
            endpoint = SERVICE_ROUTES.submitEditTransaction;
            payload = {
                transactionId: existingTransaction.id,
                amount: parseFloat(amount),
                category: (category && category.code) || 'OTHER',
                isUncommon,
                note,
                selectedDate: selectedDate.format('YYYY-MM-DD')
            };
        } else if(submissionType === SUBMISSION_TYPES.DELETE) {
            endpoint = SERVICE_ROUTES.submitDeleteTransaction;
            payload = {
                transactionId: existingTransaction.id
            };
        }

        // Invalid submissionType provided
        if(!endpoint) {
            return;
        }

        // Handle service call
        axios.post(endpoint, payload)
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
                      forwardActionCallback={() => submit(editMode ? SUBMISSION_TYPES.EDIT : SUBMISSION_TYPES.NEW)}
                      onPanelClose={onPanelClose}
        >
            <ClosePanel.Consumer>
                {
                    ({ closePanel }) => (
                        <>
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
                            {
                                editMode && (
                                    <Link text={text('DELETE')}
                                          CustomIcon={IoTrashSharp}
                                          customClass={styles.deleteLink}
                                          onClickCallback={() => {
                                              submit(SUBMISSION_TYPES.DELETE);
                                              closePanel();
                                          }}
                                    />
                                )
                            }
                        </>
                    )
                }
            </ClosePanel.Consumer>
        </SlideUpPanel>
    );
}