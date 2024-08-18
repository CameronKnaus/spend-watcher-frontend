import useContent from 'Hooks/useContent';
import styles from './ExpenseForm.module.css';
import { useForm } from 'react-hook-form';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import DatePicker from 'Components/FormInputs/DatePickerController/DatePickerController';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelectController';
import { FilterableSelectOptionType } from 'Components/FormInputs/FilterableSelect/FilterableSelect';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import { SpendingCategory } from 'Types/spendTransactionTypes';

interface ExpenseFormInputs {
    amount: number;
    category: SpendingCategory;
    note: string;
    date: Date;
    linkedTripId: string;
    selectedTrip: boolean;
}

export default function ExpenseForm() {
    const { register, control, handleSubmit } = useForm<ExpenseFormInputs>();
    const getContent = useContent('transactions');
    const getSpendCategoryLabel = useContent('SPENDING_CATEGORIES');

    return (
        <form className={styles.transactionForm}>
            {/* Amount spent */}
            <label>{getContent('amountLabel')} </label>
            <MoneyInput
                placeholder={getContent('amountPlaceholder')}
                className={styles.textInput}
                {...register('amount', { required: true })}
            />

            <label style={{ width: 100 }}>{getContent('categoryLabel')}</label>
            {/* <SpendingCategoryInputs
                defaultNoSelectionToOther
                textInputStyles={styles.textInput}
                value={category}
                onChange={setCategory}
            /> */}
            <FilterableSelect
                control={control}
                name="category"
                className={styles.textInput}
                noSelectionText={getContent('emptyPlaceholder')}
                optionsList={generateSpendCategoryList(getSpendCategoryLabel)}
            />

            {/* A short note about the transaction */}
            <label>{getContent('notesLabel')}</label>
            <input
                className={styles.textInput}
                placeholder={getContent('notesPlaceholder')}
                autoComplete="off"
                {...register('note', { maxLength: 60 })}
            />

            {/* Date of the transaction */}
            <label>{getContent('dateLabel')}</label>
            <DatePicker
                control={control}
                name="date"
                disableFuture
                views={['year', 'month', 'day']}
                format="MMMM do, yyyy"
                className={styles.textInput}
            />

            {/* Trip the transaction is linked to */}
            <label>{getContent('tripLabel')}</label>
            <FilterableSelect
                control={control}
                name="linkedTripId"
                opens="up"
                className={styles.textInput}
                noSelectionText={getContent('emptyPlaceholder')}
                optionsList={[
                    { value: '1', optionName: 'America Trip 1' },
                    { value: '2', optionName: 'Japan Trip 2' },
                    { value: '3', optionName: 'Germany Trip 3' },
                ]}
                clearLabel={getContent('clearSelection')}
            />
        </form>
    );
}

function generateSpendCategoryList(
    getContent: ReturnType<typeof useContent<'SPENDING_CATEGORIES'>>,
): FilterableSelectOptionType<SpendingCategory>[] {
    const { RESTAURANTS, GROCERIES, DRINKS, OTHER, ...rest } = SpendingCategory;

    const newOrder = [RESTAURANTS, GROCERIES, DRINKS, ...Object.values(rest), OTHER];

    return newOrder.map((category) => ({
        value: category,
        optionName: getContent(category),
        customRender: (optionName: string, value: SpendingCategory) => (
            <div className={styles.spendCategoryOption}>
                <SpendingCategoryIcon className={styles.spendCategoryIcon} category={value} size={32} />
                <div>{optionName}</div>
            </div>
        ),
    }));
}
