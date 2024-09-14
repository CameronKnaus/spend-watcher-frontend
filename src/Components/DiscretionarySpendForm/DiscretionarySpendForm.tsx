import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import DatePicker from 'Components/FormInputs/DatePickerController/DatePickerController';
import { FilterableSelectOptionType } from 'Components/FormInputs/FilterableSelect/FilterableSelect';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelectController';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
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
    onPanelClose: () => void;
};

export default function DiscretionarySpendForm({ transactionToEdit, onPanelClose }: DiscretionarySpendFormPropTypes) {
    const editMode = Boolean(transactionToEdit);
    const getContent = useContent('transactions');
    const getSpendCategoryLabel = useContent('SPENDING_CATEGORIES');
    const getGeneralContent = useContent('general');

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

    function closePanel() {
        form.reset();
        onPanelClose();
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

        closePanel();
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

                <label>{getContent('categoryLabel')}</label>
                <FilterableSelect
                    control={form.control}
                    name="category"
                    className={styles.textInput}
                    defaultValue={SpendingCategory.OTHER}
                    optionsList={generateSpendCategoryList(getSpendCategoryLabel)}
                />

                {/* A short note about the transaction */}
                <label>{getContent('notesLabel')}</label>
                <input
                    className={styles.textInput}
                    placeholder={getContent('notesPlaceholder')}
                    autoComplete="off"
                    {...form.register('note', { maxLength: 60 })}
                />

                {/* Date of the transaction */}
                <label>{getContent('dateLabel')}</label>
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
                <CustomButton variant="secondary" onClick={closePanel} layout="full-width">
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
