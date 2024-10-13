import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CustomButton from 'Components/CustomButton/CustomButton';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { FaPencilAlt } from 'react-icons/fa';
import {
    EditRecurringTransactionRequestParams,
    RecurringTransactionId,
    v1EditRecurringTransactionSchema,
} from 'Types/Services/spending.model';
import formatCurrency from 'Util/Formatters/formatCurrency/formatCurrency';
import styles from './EditableRecurringTransactionRow.module.css';

type EditableRecurringTransactionRowPropTypes = {
    transactionId: RecurringTransactionId;
    label: string;
    amountSpent?: number;
    expectedMonthlyAmount: number;
};

export default function EditableRecurringTransactionRow({
    transactionId,
    label,
    amountSpent,
    expectedMonthlyAmount,
}: EditableRecurringTransactionRowPropTypes) {
    const queryClient = useQueryClient();
    const recurringTransactionMutation = useMutation({
        mutationKey: [transactionId],
        mutationFn: (params: EditRecurringTransactionRequestParams) => {
            return axios.post(SERVICE_ROUTES.postEditRecurringTransaction, {
                ...params,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['recurring'],
            });
        },
        onError: () => {
            // TODO: Error handling
        },
    });

    const getContent = useContent('recurringTransactionsList');
    const form = useForm<EditRecurringTransactionRequestParams>({
        resolver: zodResolver(v1EditRecurringTransactionSchema),
        defaultValues: {
            transactionId,
            amountSpent: amountSpent,
        },
    });

    function handleSubmission(submission: EditRecurringTransactionRequestParams) {
        recurringTransactionMutation.mutate(submission);
    }

    const isDirty = form.formState.isDirty;
    const isValidInput = form.formState.isValid;
    const isLoading = recurringTransactionMutation.isPending;

    return (
        <div className={styles.rowContainer}>
            <div className={styles.date}>{label}</div>
            <div>
                <label className={styles.label}>{getContent('amountSpentLabel')}</label>
                <div className={styles.moneyInputContainer}>
                    <div className={styles.editIcon}>{!isLoading && <FaPencilAlt />}</div>
                    <form onSubmit={form.handleSubmit(handleSubmission)}>
                        {isLoading ? (
                            <SkeletonLoader style={{ height: 40, width: 200 }} />
                        ) : (
                            <MoneyInput
                                isRequired
                                className={styles.moneyInput}
                                control={form.control}
                                name="amountSpent"
                                placeholder={formatCurrency(expectedMonthlyAmount)}
                                hookFormSetValue={form.setValue}
                            />
                        )}
                    </form>
                </div>
                {isDirty && isValidInput && (
                    <CustomButton
                        type="submit"
                        variant="primary"
                        className={styles.confirmChangeButton}
                        layout="full-width"
                        onClick={form.handleSubmit(handleSubmission)}
                        isDisabled={isLoading}
                    >
                        {getContent('confirmChange')}
                    </CustomButton>
                )}
            </div>
        </div>
    );
}
