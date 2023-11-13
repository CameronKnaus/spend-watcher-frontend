import { Dispatch, SetStateAction, useState } from 'react';
import EditableTransactionListItem from './EditableTransactionListItem';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import dayjs from 'dayjs';
import generateParamsForGET from 'Util/generateParamsForGET';
import useContent from 'CustomHooks/useContent';
import formatCurrency from 'Util/Formatters/formatCurrency';
import axios from 'axios';
import { RecurringTransaction } from 'Types/TransactionTypes';
import { invalidateQueries, recurringExpenseTransactionHistoryQueryKey, recurringTransactionDependentQueryKeys } from 'Util/QueryKeys';
import msMapper from 'Util/Time/TimeMapping';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import recurringTransactionHistoryTransform from './recurringTransactionHistoryTransform';
import EditableTransactionListItemLoader from './EditableTransactionListItemLoader';

type RecurringSpendTransactionHistoryPropTypes = {
    recurringExpense: RecurringTransaction;
    setHistoryModified: Dispatch<SetStateAction<boolean>>;
}

export default function RecurringSpendTransactionHistory({ recurringExpense, setHistoryModified }: RecurringSpendTransactionHistoryPropTypes) {
    const getContent = useContent('RECURRING_SPENDING');
    const [lastEditedTransactionId, setLastEditedTransactionId] = useState('');
    const [successfulLoadOccurred, setSuccessfulLoadOccurred] = useState(false);
    const queryClient = useQueryClient();

    const currentDate = dayjs(new Date()).format('YYYY-MM');
    // TODO: Handle error scenario
    const { isLoading, data: response } = useQuery({
        queryKey: [
            recurringExpenseTransactionHistoryQueryKey, recurringExpense.recurringSpendId, currentDate
        ],
        staleTime: msMapper.day,
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.getRecurringExpenseTransactionHistory + generateParamsForGET({
                recurringSpendId: recurringExpense.recurringSpendId,
                currentDate
            }));
        },
        select: recurringTransactionHistoryTransform
    });

    if(isLoading && !successfulLoadOccurred) {
        return new Array(3).fill('').map((_, index) => (
            <div key={`loading-transaction-${index}`} // eslint-disable-line react/no-array-index-key
                 style={{ paddingBottom: 16 }}
            >
                <EditableTransactionListItemLoader label={getContent('AMOUNT_SPENT_LABEL')} />
            </div>
        ));
    }

    function handleSubmission(newExpenseAmount: number | null, transactionId: string, date: string, isNewTransaction: boolean) {
        if(newExpenseAmount == null || !response) {
            return;
        }

        // Use the date for new transactions that don't yet have a transaction ID
        setLastEditedTransactionId(isNewTransaction ? date : transactionId);

        setHistoryModified(true);

        const payload = {
            recurringSpendId: response.recurringSpendId,
            amountSpent: Number(newExpenseAmount),
            transactionId: transactionId,
            date: dayjs(date + '-1').format('YYYY-MM'),
            isRevision: !isNewTransaction
        };

        // Handle service call
        axios.post(SERVICE_ROUTES.updateRecurringExpense, payload).then(() => {
            setTimeout(() => {
                setLastEditedTransactionId('');
                invalidateQueries(queryClient, recurringTransactionDependentQueryKeys);
            }, 300);

            setSuccessfulLoadOccurred(true);
        });
    }

    const estimatedAmount = response?.estimatedAmount;

    return (
        <div style={{ paddingBottom: '1rem' }}>
            {
                !response?.hasThisMonthLogged && (
                    <EditableTransactionListItem isNewTransaction
                                                 newTransactionLabel={getContent('ADD_TRANSACTION', [dayjs(currentDate).format('MM/YYYY')])}
                                                 confirmButtonLabel={getContent('CONFIRM_CHANGE')}
                                                 amount={estimatedAmount || 0}
                                                 amountLabel={getContent('AMOUNT_SPENT_LABEL')}
                                                 date={currentDate}
                                                 placeholderLabel={formatCurrency(estimatedAmount || 0)}
                                                 showAsLoader={currentDate === lastEditedTransactionId}
                                                 onConfirm={handleSubmission}
                    />
                )
            }
            {
                response?.transactionList.map(({ transactionId, date, transactionAmount }) => {
                    return (
                        <EditableTransactionListItem key={date}
                                                     confirmButtonLabel={getContent('CONFIRM_CHANGE')}
                                                     amount={transactionAmount}
                                                     amountLabel={getContent('AMOUNT_SPENT_LABEL')}
                                                     date={date}
                                                     placeholderLabel={formatCurrency(estimatedAmount || 0)}
                                                     showAsLoader={lastEditedTransactionId === transactionId}
                                                     transactionId={transactionId}
                                                     isNewTransaction={false}
                                                     onConfirm={handleSubmission}
                        />
                    );
                })
            }
            <EditableTransactionListItem key={response?.missingDate}
                                         isNewTransaction
                                         newTransactionLabel={getContent('ADD_TRANSACTION', [dayjs(response?.missingDate).format('MM/YYYY')])}
                                         confirmButtonLabel={getContent('CONFIRM_CHANGE')}
                                         amount={estimatedAmount || 0}
                                         amountLabel={getContent('AMOUNT_SPENT_LABEL')}
                                         date={`${response?.missingDate}`}
                                         placeholderLabel={formatCurrency(estimatedAmount || 0)}
                                         showAsLoader={response?.missingDate === lastEditedTransactionId}
                                         onConfirm={handleSubmission}
            />
        </div>
    );
}