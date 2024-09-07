import DatePicker from 'Components/FormInputs/DatePickerController/DatePickerController';
import { FilterableSelectOptionType } from 'Components/FormInputs/FilterableSelect/FilterableSelect';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelectController';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { SpendingCategory } from 'Types/SpendingCategory';
import styles from './ExpenseForm.module.css';

export interface ExpenseFormInputs {
    amount: number;
    category: SpendingCategory;
    note: string;
    date: Date;
    linkedTripId: string;
    selectedTrip: boolean;
}

type ExpenseFormPropTypes = {
    onSubmit: (data: ExpenseFormInputs) => void;
} & ReturnType<typeof useForm<ExpenseFormInputs>>;

export default function ExpenseForm({ onSubmit, ...hookForm }: ExpenseFormPropTypes) {
    const getContent = useContent('transactions');
    const getSpendCategoryLabel = useContent('SPENDING_CATEGORIES');

    return (
        <form className={styles.transactionForm} onSubmit={hookForm.handleSubmit(onSubmit)}>
            {/* Amount spent */}
            <label>{getContent('amountLabel')}</label>
            <MoneyInput
                isRequired
                control={hookForm.control}
                name="amount"
                placeholder={getContent('amountPlaceholder')}
                hookFormSetValue={hookForm.setValue}
                className={styles.textInput}
            />

            <label style={{ width: 100 }}>{getContent('categoryLabel')}</label>
            <FilterableSelect
                control={hookForm.control}
                name="category"
                className={styles.textInput}
                noSelectionText={getSpendCategoryLabel(SpendingCategory.OTHER)}
                optionsList={generateSpendCategoryList(getSpendCategoryLabel)}
            />

            {/* A short note about the transaction */}
            <label>{getContent('notesLabel')}</label>
            <input
                className={styles.textInput}
                placeholder={getContent('notesPlaceholder')}
                autoComplete="off"
                {...hookForm.register('note', { maxLength: 60 })}
            />

            {/* Date of the transaction */}
            <label>{getContent('dateLabel')}</label>
            <DatePicker
                control={hookForm.control}
                name="date"
                disableFuture
                views={['year', 'month', 'day']}
                format="MMMM do, yyyy"
                className={styles.textInput}
            />

            {/* Trip the transaction is linked to */}
            <label>{getContent('tripLabel')}</label>
            <FilterableSelect
                control={hookForm.control}
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
