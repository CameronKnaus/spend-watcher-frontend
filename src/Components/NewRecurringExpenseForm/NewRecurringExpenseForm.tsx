import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelectController';
import useSpendCategoryList from 'Components/FormInputs/FilterableSelect/presetLists/useSpendCategoryList/useSpendCategoryList';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { AddRecurringSpendRequestParams, v1AddRecurringSpendSchema } from 'Types/Services/spending.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import styles from './NewRecurringExpenseForm.module.css';

type NewRecurringExpenseFormPropTypes = {
    onCancel: () => void;
};

export default function NewRecurringExpenseForm({ onCancel }: NewRecurringExpenseFormPropTypes) {
    const getContent = useContent('recurringSpending');
    const getGeneralContent = useContent('general');
    const spendingCategoryList = useSpendCategoryList();

    const form = useForm<AddRecurringSpendRequestParams>({
        resolver: zodResolver(v1AddRecurringSpendSchema),
        defaultValues: {
            category: SpendingCategory.OTHER,
        },
    });

    function handleCancel() {
        form.reset();
        onCancel();
    }

    function onSubmit(submission: AddRecurringSpendRequestParams) {
        axios.post(SERVICE_ROUTES.postAddRecurringSpend, submission);
        handleCancel();
    }

    return (
        <>
            <form className={styles.newRecurringSpendForm} onSubmit={form.handleSubmit(onSubmit)}>
                {/* Expense name */}
                <label>{getContent('newRecurringExpenseTitle')}</label>
                <input
                    className={styles.textInput}
                    placeholder={getContent('newSpendNamePlaceholder')}
                    autoComplete="off"
                    {...form.register('recurringSpendName', { required: true, maxLength: 60 })}
                />

                {/* Spend category */}
                <label>{getContent('categoryLabel')}</label>
                <FilterableSelect
                    control={form.control}
                    name="category"
                    className={styles.textInput}
                    defaultValue={SpendingCategory.OTHER}
                    optionsList={spendingCategoryList}
                />

                {/* Is variable expense */}
                <div
                    className={styles.checkInputContainer}
                    onClick={() => form.setValue('isVariableRecurring', !form.getValues('isVariableRecurring'))}
                >
                    <input
                        className={styles.checkBox}
                        type="checkbox"
                        aria-label={`${getContent('variableExpenseLabel')}. ${getContent('variableExpenseDescription')}`}
                        {...form.register('isVariableRecurring')}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <label aria-hidden>{getContent('variableExpenseLabel')}</label>
                    <span className={styles.varyingDescription}>{getContent('variableExpenseDescription')}</span>
                </div>

                {/* Monthly amount */}
                <label>
                    {getContent(form.watch('isVariableRecurring') ? 'monthlyAmountVariesLabel' : 'monthlyAmountLabel')}
                </label>
                <MoneyInput
                    isRequired
                    control={form.control}
                    name="expectedMonthlyAmount"
                    placeholder={getContent('monthlyAmountPlaceholder')}
                    hookFormSetValue={form.setValue}
                    className={styles.textInput}
                />
            </form>
            <BottomSheet>
                <CustomButton variant="secondary" onClick={handleCancel} layout="full-width">
                    {getGeneralContent('cancel')}
                </CustomButton>
                <CustomButton
                    isDisabled={!form.formState.isValid}
                    variant="primary"
                    onClick={form.handleSubmit(onSubmit)}
                    layout="full-width"
                >
                    {getGeneralContent('submit')}
                </CustomButton>
            </BottomSheet>
        </>
    );
}
