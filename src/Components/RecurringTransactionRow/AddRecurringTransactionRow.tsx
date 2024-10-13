import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CustomButton from 'Components/CustomButton/CustomButton';
import MoneyInput from 'Components/FormInputs/MoneyInput/MoneyInput';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { format, parse } from 'date-fns';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPencilAlt } from 'react-icons/fa';
import { MonthYearDbDate } from 'Types/dateTypes';
import { AddRecurringTransactionRequestParams, v1AddRecurringTransactionSchema } from 'Types/Services/spending.model';
import formatCurrency from 'Util/Formatters/formatCurrency/formatCurrency';
import styles from './RecurringTransactionRow.module.css';

type AddRecurringTransactionRowPropTypes = {
    expectedMonthlyAmount: number;
    recurringSpendId: string;
    date: MonthYearDbDate;
};

export default function AddRecurringTransactionRow({
    date,
    recurringSpendId,
    expectedMonthlyAmount,
}: AddRecurringTransactionRowPropTypes) {
    const [isActive, setIsActive] = useState(false);

    const getContent = useContent('recurringTransactionsList');
    const queryClient = useQueryClient();
    const recurringTransactionMutation = useMutation({
        mutationKey: [date],
        mutationFn: (params: AddRecurringTransactionRequestParams) => {
            return axios.post(SERVICE_ROUTES.postAddRecurringTransaction, {
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

    const form = useForm<AddRecurringTransactionRequestParams>({
        resolver: zodResolver(v1AddRecurringTransactionSchema),
        defaultValues: {
            amountSpent: expectedMonthlyAmount,
            recurringSpendId,
            date,
        },
    });

    const formattedDate = format(parse(date, 'yyyy-MM', new Date()), 'MMMM yyyy');
    if (!isActive) {
        return (
            <CustomButton key={date} layout="full-width" className={styles.addNewRow} onClick={() => setIsActive(true)}>
                {getContent('addNewRow', [formattedDate])}
            </CustomButton>
        );
    }

    function handleSubmission(submission: AddRecurringTransactionRequestParams) {
        recurringTransactionMutation.mutate(submission);
    }

    const isDirty = form.formState.isDirty;
    const isValidInput = form.formState.isValid;
    const isLoading = recurringTransactionMutation.isPending;

    // TODO: Worth combining with EditableRecurringTransactionRow?
    return (
        <div className={styles.rowContainer}>
            <div className={styles.date}>{formattedDate}</div>
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
                                trigger={form.trigger}
                                name="amountSpent"
                                placeholder={formatCurrency(expectedMonthlyAmount)}
                                onFocus={() => {
                                    // If the user clicks on the input, and the form isn't dirty, set it to zero to allow for easier editing
                                    if (!isDirty) {
                                        form.setValue('amountSpent', 0);
                                    }
                                }}
                            />
                        )}
                    </form>
                </div>
                {isValidInput && (
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
