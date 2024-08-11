import useContent from 'Hooks/useContent';
import styles from './ExpenseForm.module.css';
import { Controller, useForm } from 'react-hook-form';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import { DatePicker } from '@mui/x-date-pickers';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelect';

interface ExpenseFormInputs {
    amount: number;
    category: string;
    note: string;
    date: Date;
    linkedTripId: string;
    selectedTrip: boolean;
}

export default function ExpenseForm() {
    const { register, control, handleSubmit, watch } = useForm<ExpenseFormInputs>();
    const getContent = useContent('TRANSACTIONS');

    console.log(watch());

    return (
        <form className={styles.transactionForm}>
            {/* Amount spent */}
            <label>{getContent('AMOUNT_LABEL')} </label>
            <MoneyInput
                placeholder={getContent('AMOUNT_PLACEHOLDER')}
                className={styles.textInput}
                {...register('amount', { required: true })}
            />
            {/* <label htmlFor="category-input" style={{ width: 100 }}>
                    {getContent('CATEGORY_LABEL')}
                </label>
                <SpendingCategoryInputs
                    defaultNoSelectionToOther
                    textInputStyles={styles.textInput}
                    value={category}
                    onChange={setCategory}
                /> */}
            {/* A short note about the transaction */}
            <label>{getContent('NOTES_LABEL')}</label>
            <input
                className={styles.textInput}
                placeholder={getContent('NOTES_PLACEHOLDER')}
                autoComplete="off"
                {...register('note', { maxLength: 60 })}
            />
            {/* Date of the transaction */}
            <label>{getContent('DATE_LABEL')}</label>
            <Controller
                control={control}
                name="date"
                render={({ field }) => (
                    <DatePicker
                        disableFuture
                        views={['year', 'month', 'day']}
                        format="MMMM D, YYYY"
                        defaultValue={field.value}
                        className={styles.textInput}
                        onChange={field.onChange}
                        onAccept={field.onChange}
                    />
                )}
            />
            {/* Trip the transaction is linked to */}
            <label htmlFor="trip-input">{getContent('TRIP_LABEL')}</label>
            <Controller
                control={control}
                name="linkedTripId"
                render={({ field: { value, onBlur, onChange, ref } }) => (
                    <FilterableSelect
                        ref={ref}
                        selectedValue={value}
                        setSelectedValue={onChange}
                        onChange={onChange}
                        onBlur={onBlur}
                        optionsList={[
                            { value: '1', optionName: 'America Trip 1' },
                            { value: '2', optionName: 'Japan Trip 2' },
                            { value: '3', optionName: 'Germany Grip 3' },
                        ]}
                    />
                )}
            />
            {/* {filterableSelectTripsList.length ? (
                <>
                    <FilterableSelect
                        value={linkedTripId}
                        optionsList={filterableSelectTripsList}
                        id="trip-selector"
                        textInputStyles={styles.textInput}
                        nothingSelectedText={getContent('NO_TRIPS')}
                        setValue={(selectedTrip) => {
                            if (typeof selectedTrip === 'string') {
                                setTripSelected(true);
                                setLinkedTripId(selectedTrip);
                            }
                        }}
                    />
                    <div style={{ height: '1rem' }} />
                </>
            ) : (
                <div className={styles.noTripMessage}>{getContent('NO_TRIPS_AVAILABLE')}</div>
            )} */}
        </form>
    );
}
