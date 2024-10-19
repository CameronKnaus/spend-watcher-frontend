import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import DatePicker from 'Components/FormInputs/DatePickerController/DatePickerController';
import FilterableSelect from 'Components/FormInputs/FilterableSelect/FilterableSelectController';
import useSpendCategoryList from 'Components/FormInputs/FilterableSelect/presetLists/useSpendCategoryList/useSpendCategoryList';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import useTripsList from 'Hooks/useTripsList/useTripsList';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DiscretionarySpendTransaction, v1DiscretionaryAddSchema } from 'Types/Services/spending.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import styles from './DiscretionarySpendForm.module.css';

export type DiscretionarySpendFormAttributes = Omit<DiscretionarySpendTransaction, 'transactionId' | 'isRecurring'>;

type DiscretionarySpendFormPropTypes = {
    transactionToEdit?: DiscretionarySpendTransaction;
    onCancel: () => void;
    onSubmit: () => void;
};

export const addDiscretionaryQueryKey = 'add-discretionary';
export const editDiscretionaryQueryKey = 'edit-discretionary';

export default function DiscretionarySpendForm({
    transactionToEdit,
    onCancel,
    onSubmit,
}: DiscretionarySpendFormPropTypes) {
    const editMode = Boolean(transactionToEdit);
    const getContent = useContent('transactions');
    const getGeneralContent = useContent('general');
    const spendingCategoryList = useSpendCategoryList();
    const queryClient = useQueryClient();
    const { tripsList } = useTripsList();

    const transactionService = useMutation({
        mutationKey: transactionToEdit
            ? [editDiscretionaryQueryKey, transactionToEdit.transactionId]
            : [addDiscretionaryQueryKey],
        mutationFn: (params: DiscretionarySpendFormAttributes) => {
            if (editMode) {
                return axios.post(SERVICE_ROUTES.postEditDiscretionarySpending, {
                    ...params,
                    transactionId: transactionToEdit?.transactionId,
                });
            } else {
                return axios.post(SERVICE_ROUTES.postAddDiscretionarySpending, params);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['spending'],
            });

            // Reset form
            form.reset();
        },
        onError: () => {
            // TODO: Error handling
        },
    });

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

    async function handleSubmission(submission: DiscretionarySpendFormAttributes) {
        await transactionService.mutate(submission);
        onSubmit();
    }

    return (
        <>
            <form className={styles.transactionForm} onSubmit={form.handleSubmit(handleSubmission)}>
                {/* Amount spent */}
                <label>{getContent('amountLabel')}</label>
                <MoneyInput
                    isRequired
                    control={form.control}
                    trigger={form.trigger}
                    name="amountSpent"
                    placeholder={getContent('amountPlaceholder')}
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
                    optionsList={
                        tripsList?.map((tripDetails) => ({
                            value: tripDetails.trip.tripId,
                            optionName: tripDetails.trip.tripName,
                        })) ?? []
                    }
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
                    onClick={form.handleSubmit(handleSubmission)}
                    layout="full-width"
                >
                    {getGeneralContent('submit')}
                </CustomButton>
            </BottomSheet>
        </>
    );
}
