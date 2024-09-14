import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import DatePicker from 'Components/FormInputs/DatePickerController/DatePickerController';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelectController';
import useSpendCategoryList from 'Components/FormInputs/FilterableSelect/presetLists/useSpendCategoryList/useSpendCategoryList';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DiscretionarySpendTransaction, v1DiscretionaryAddSchema } from 'Types/Services/spending.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import styles from './DiscretionarySpendForm.module.css';

export type DiscretionarySpendFormAttributes = Omit<DiscretionarySpendTransaction, 'transactionId' | 'isRecurring'>;

type DiscretionarySpendFormPropTypes = {
    transactionToEdit?: DiscretionarySpendTransaction;
    onCancel: () => void;
};

export default function DiscretionarySpendForm({ transactionToEdit, onCancel }: DiscretionarySpendFormPropTypes) {
    const editMode = Boolean(transactionToEdit);
    const getContent = useContent('transactions');
    const getGeneralContent = useContent('general');
    const spendingCategoryList = useSpendCategoryList();

    // All form handling managed here
    const form = useForm<DiscretionarySpendFormAttributes>({
        resolver: zodResolver(v1DiscretionaryAddSchema),
        mode: 'onChange', // Least performant but not a concern here
        defaultValues: {
            category: SpendingCategory.OTHER,
        },
    });

    useEffect(() => {
        form.reset(transactionToEdit);
    }, [transactionToEdit, form]);

    function handleCancel() {
        form.reset();
        onCancel();
    }

    function onSubmit(submission: DiscretionarySpendFormAttributes) {
        if (editMode) {
            // Editing existing transaction
            const payload = {
                ...submission,
                transactionId: transactionToEdit?.transactionId,
            };

            // TODO: Change to Tanstack useMutation hook
            axios.post(SERVICE_ROUTES.postEditDiscretionarySpending, payload);
        } else {
            // New transaction
            const payload = {
                ...submission,
            };

            axios.post(SERVICE_ROUTES.postAddDiscretionarySpending, payload);
        }

        // Reset form
        handleCancel();
    }

    return (
        <>
            <form className={styles.transactionForm} onSubmit={form.handleSubmit(onSubmit)}>
                {/* Amount spent */}
                <label>{getContent('amountLabel')}</label>
                <MoneyInput
                    isRequired
                    control={form.control}
                    name="amountSpent"
                    placeholder={getContent('amountPlaceholder')}
                    hookFormSetValue={form.setValue}
                    className={styles.textInput}
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

                {/* A short note about the transaction */}
                <label>{getContent('notesLabel')}</label>
                <input
                    className={styles.textInput}
                    placeholder={getContent('notesPlaceholder')}
                    autoComplete="off"
                    {...form.register('note', { maxLength: 100 })}
                />

                {/* Date of the transaction */}
                <label className={styles.dateLabel}>{getContent('dateLabel')}</label>
                <DatePicker
                    isRequired
                    control={form.control}
                    name="spentDate"
                    disableFuture
                    views={['year', 'month', 'day']}
                    format="MMMM do, yyyy"
                    className={styles.textInput}
                />

                {/* Trip the transaction is linked to */}
                <label>{getContent('tripLabel')}</label>
                <FilterableSelect
                    control={form.control}
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