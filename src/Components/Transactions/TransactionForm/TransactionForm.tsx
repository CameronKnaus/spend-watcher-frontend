import useContent from 'CustomHooks/useContent';
import styles from './TransactionForm.module.css';
import MoneyInput from 'Components/UIElements/Form/MoneyInput/MoneyInput';
import { SpendingCategoryInputs } from 'Components/UIElements/Form/CategoryInput/CategoryInput';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import SlideUpPanel, { ClosePanel } from 'Components/UIElements/Modal/SlideUpPanel/SlideUpPanel';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import axios from 'axios';
import Link from 'Components/UIElements/Navigation/Link/Link';
import { IoTrashSharp } from 'react-icons/io5';
import useTripDetails from 'CustomHooks/useTripDetails';
import FilterableSelect from 'Components/UIElements/Form/FilterableSelect/FilterableSelect';
import Alert from 'Components/UIElements/Informational/Alert/Alert';
import { EmptyCallback } from 'Types/QoLTypes';
import { SpendingCategoryType } from 'Constants/categories';
import { FormattedTransaction } from 'Types/TransactionTypes';
import { useEffect, useState } from 'react';
import { transactionDependentQueryKeys } from 'Util/QueryKeys';
import { useQueryClient } from '@tanstack/react-query';

enum SubmissionType {
    DELETE = 'DELETE',
    EDIT = 'EDIT',
    NEW = 'NEW'
}

type TransactionFormPropTypes = {
    onPanelClose: EmptyCallback,
    onSubmission?: EmptyCallback,
    editMode: true,
    existingTransaction: FormattedTransaction
} | {
    onPanelClose: EmptyCallback,
    onSubmission?: EmptyCallback,
    editMode?: false,
    existingTransaction?: never
}

// existingTransaction should be an object containing all transaction keys
export default function TransactionForm({
    onPanelClose,
    onSubmission = () => { /* NOOP */ },
    editMode = false,
    existingTransaction = {} as FormattedTransaction
}: TransactionFormPropTypes) {
    const getContent = useContent('TRANSACTIONS');
    const queryClient = useQueryClient();

    const { filterableSelectTripsList, activeTrip } = useTripDetails();

    // State for form values
    const [formValid, setFormValid] = useState(Boolean(existingTransaction.amount)); // defaults false
    const [amount, setAmount] = useState<number | null>(existingTransaction.amount ?? null);
    const [category, setCategory] = useState<SpendingCategoryType | ''>(existingTransaction.category || SpendingCategoryType.OTHER);
    const [isUncommon, setIsUncommon] = useState(Boolean(existingTransaction.isUncommon));
    const [note, setNote] = useState(existingTransaction.note || '');
    const [selectedDate, setSelectedDate] = useState<Dayjs>(existingTransaction.date ? dayjs(existingTransaction.date) : dayjs()); // defaults to today
    const [linkedTripId, setLinkedTripId] = useState(() => {
        if(existingTransaction.linkedTripId) {
            return existingTransaction.linkedTripId;
        }

        if(activeTrip && !editMode) {
            return activeTrip.tripId;
        }

        return '';
    });
    const [tripSelected, setTripSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    // Update form validity only based on amount having a positive value
    useEffect(() => {
        setFormValid((amount ?? 0) > 0 && selectedDate.isValid());
    }, [amount, selectedDate]);

    function submit(submissionType: SubmissionType) {
        if(loading) {
            return;
        }

        // Create the payload and target endpoint based on submission type
        let endpoint, payload;
        if(submissionType === SubmissionType.NEW) {
            endpoint = SERVICE_ROUTES.submitNewTransaction;
            payload = {
                amount: parseFloat(`${amount}`), // TODO: Check that this conersion is necessary still?
                category: category || 'OTHER',
                isUncommon,
                note,
                selectedDate: selectedDate.format('YYYY-MM-DD'),
                linkedTripId
            };
        } else if(submissionType === SubmissionType.EDIT) {
            endpoint = SERVICE_ROUTES.submitEditTransaction;
            payload = {
                transactionId: existingTransaction.id,
                amount: parseFloat(`${amount}`),
                category: category || 'OTHER',
                isUncommon,
                note,
                selectedDate: selectedDate.format('YYYY-MM-DD'),
                linkedTripId
            };
        } else if(submissionType === SubmissionType.DELETE) {
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
            .then(() => {
                // Invalidate any queries that may be dependent on transactions
                queryClient.invalidateQueries(transactionDependentQueryKeys);
                onSubmission();
            })
            .finally(() => setLoading(false));
    }

    const UNCOMMON_LABEL = getContent('UNCOMMON_LABEL');
    const UNCOMMON_DESCRIPTION = getContent('UNCOMMON_DESCRIPTION');
    return (
        <SlideUpPanel title={getContent(editMode ? 'EDIT_EXPENSE' : 'NEW_EXPENSE')}
                      closeText={getContent('CANCEL')}
                      confirmText={getContent(editMode ? 'EDIT' : 'SUBMIT')}
                      disableConfirmButton={!formValid}
                      forwardActionCallback={() => submit(editMode ? SubmissionType.EDIT : SubmissionType.NEW)}
                      onPanelClose={onPanelClose}
        >
            <ClosePanel.Consumer>
                {
                    (closePanel) => (
                        <>
                            {
                                (!editMode && !tripSelected && activeTrip) && (
                                    <div className={styles.alertContainer}>
                                        <Alert alertText={getContent('ACTIVE_TRIP', [activeTrip.tripName, activeTrip.startDate, activeTrip.endDate])}
                                               color='var(--theme-yellow-orange)'
                                               size='small'
                                        />
                                    </div>
                                )
                            }
                            <form className={styles.transactionForm}>
                                <label>
                                    {getContent('AMOUNT_LABEL')}
                                    <MoneyInput name='amount-spent-field'
                                                placeholder={getContent('AMOUNT_PLACEHOLDER')}
                                                className={styles.textInput}
                                                stateUpdater={setAmount}
                                                value={amount}
                                    />
                                </label>
                                <label htmlFor='category-input' style={{ width: 100 }}>
                                    {getContent('CATEGORY_LABEL')}
                                </label>
                                <SpendingCategoryInputs textInputStyles={styles.textInput}
                                                        value={category}
                                                        onChange={setCategory}
                                />
                                <label>
                                    {getContent('NOTES_LABEL')}
                                    <input type='text'
                                           className={styles.textInput}
                                           placeholder={getContent('NOTES_PLACEHOLDER')}
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
                                    {getContent('DATE_LABEL')}
                                </label>
                                <DatePicker disableFuture
                                            views={['year', 'month', 'day']}
                                            format='MMMM D, YYYY'
                                            value={selectedDate}
                                            className={styles.textInput}
                                            onChange={(value) => {
                                                value && setSelectedDate(value);
                                            }}
                                />
                                <div style={{ height: '1.5rem' }} />
                                <label htmlFor='trip-input'>
                                    {getContent('TRIP_LABEL')}
                                </label>
                                {
                                    filterableSelectTripsList.length ? (
                                        <>
                                            <FilterableSelect value={linkedTripId}
                                                              optionsList={filterableSelectTripsList}
                                                              id='trip-selector'
                                                              textInputStyles={styles.textInput}
                                                              nothingSelectedText={getContent('NO_TRIPS')}
                                                              setValue={(selectedTrip) => {
                                                                setTripSelected(true);
                                                                setLinkedTripId(selectedTrip);
                                                              }}
                                            />
                                            <div style={{ height: '1rem' }} />
                                        </>
                                    ) : (
                                        <div className={styles.noTripMessage}>
                                            {getContent('NO_TRIPS_AVAILABLE')}
                                        </div>
                                    )

                                }
                            </form>
                            {
                                editMode && (
                                    <Link text={getContent('DELETE')}
                                          CustomIcon={IoTrashSharp}
                                          customClass={styles.deleteLink}
                                          onClickCallback={() => {
                                              submit(SubmissionType.DELETE);
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