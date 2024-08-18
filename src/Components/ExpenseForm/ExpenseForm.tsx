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
    const getGeneralContent = useContent('GENERAL');
    const getContent = useContent('TRANSACTIONS');
    const getSpendCategoryLabel = useContent('SPENDING_CATEGORIES');

    return (
        <form className={styles.transactionForm}>
            {/* Amount spent */}
            <label>{getContent('AMOUNT_LABEL')} </label>
            <MoneyInput
                placeholder={getContent('AMOUNT_PLACEHOLDER')}
                className={styles.textInput}
                {...register('amount', { required: true })}
            />

            <label style={{ width: 100 }}>{getContent('CATEGORY_LABEL')}</label>
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
                noSelectionText={getGeneralContent('EMPTY')}
                optionsList={generateSpendCategoryList(getSpendCategoryLabel)}
            />

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
            <DatePicker
                control={control}
                name="date"
                disableFuture
                views={['year', 'month', 'day']}
                format="MMMM do, yyyy"
                className={styles.textInput}
            />

            {/* Trip the transaction is linked to */}
            <label>{getContent('TRIP_LABEL')}</label>
            <FilterableSelect
                control={control}
                name="linkedTripId"
                opens="up"
                className={styles.textInput}
                noSelectionText={getGeneralContent('EMPTY')}
                optionsList={[
                    { value: '1', optionName: 'America Trip 1' },
                    { value: '2', optionName: 'Japan Trip 2' },
                    { value: '3', optionName: 'Germany Trip 3' },
                ]}
                clearLabel={getGeneralContent('CLEAR_SELECTION')}
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
                <SpendingCategoryIcon className={styles.spendCategoryIcon} categoryCode={value} size={32} />
                <div>{optionName}</div>
            </div>
        ),
    }));
}
