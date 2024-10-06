import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CustomButton from 'Components/CustomButton/CustomButton';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { FaPencilAlt } from 'react-icons/fa';
import { DbDate } from 'Types/dateTypes';
import {
    EditRecurringTransactionRequestParams,
    RecurringTransactionId,
    v1EditRecurringTransactionSchema,
} from 'Types/Services/spending.model';
import formatCurrency from 'Util/Formatters/formatCurrency/formatCurrency';
import styles from './EditableRecurringTransactionRow.module.css';

type EditableRecurringTransactionRowPropTypes = {
    transactionId: RecurringTransactionId;
    date: DbDate;
    amountSpent?: number;
    expectedMonthlyAmount: number;
};

export default function EditableRecurringTransactionRow({
    transactionId,
    date,
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

    return (
        <div className={styles.rowContainer}>
            <div className={styles.date}>{format(date, 'MMM yyyy')}</div>
            <div>
                <label className={styles.label}>{getContent('amountSpentLabel')}</label>
                <div className={styles.moneyInputContainer}>
                    <div className={styles.editIcon}>
                        <FaPencilAlt />
                    </div>
                    <form onSubmit={form.handleSubmit(handleSubmission)}>
                        <MoneyInput
                            isRequired
                            className={styles.moneyInput}
                            control={form.control}
                            name="amountSpent"
                            placeholder={formatCurrency(expectedMonthlyAmount)}
                            hookFormSetValue={form.setValue}
                        />
                    </form>
                </div>
                {isDirty && isValidInput && (
                    <CustomButton
                        type="submit"
                        variant="primary"
                        className={styles.confirmChangeButton}
                        layout="full-width"
                        onClick={form.handleSubmit(handleSubmission)}
                    >
                        {getContent('confirmChange')}
                    </CustomButton>
                )}
            </div>
        </div>
    );
}
