import { useState } from 'react';
import EditableTransactionListItem from './EditableTransactionListItem';
import useFetch from 'CustomHooks/useFetch';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import dayjs from 'dayjs';
import generateParamsForGET from 'Util/generateParamsForGET';
import useContent from 'CustomHooks/useContent';
import formatCurrency from 'Util/Formatters/formatCurrency';
import axios from 'axios';

export default function RecurringSpendTransactionHistory({ recurringExpense, setHistoryModified }) {
    const [lastEditedTransactionId, setLastEditedTransactionId] = useState('');
    const [successfulLoadOccurred, setSuccessfulLoadOccurred] = useState(false);

    const currentDate = dayjs(new Date()).format('YYYY-MM');
    const getContent = useContent('RECURRING_SPENDING');
    const { response, loading, silentLoadingStatus, fire } = useFetch(SERVICE_ROUTES.getRecurringExpenseTransactionHistory + generateParamsForGET({
        recurringSpendId: recurringExpense.recurringSpendId,
        currentDate
    }), true, false);

    if(loading && !successfulLoadOccurred) {
        return new Array(3).fill('').map((_, index) => (
            <div key={`loading-transaction-${index}`} // eslint-disable-line react/no-array-index-key
                 style={{ paddingBottom: 16 }}
            >
                <EditableTransactionListItem showAsLoader amountLabel={getContent('AMOUNT_SPENT_LABEL')} />
            </div>
        )
        );
    }

    function handleSubmission(newExpenseAmount, transactionId, date, isNewTransaction) {
        if(newExpenseAmount == null) {
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
                fire(true);
                setLastEditedTransactionId('');
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
                                                 amount={estimatedAmount}
                                                 amountLabel={getContent('AMOUNT_SPENT_LABEL')}
                                                 date={currentDate}
                                                 placeholderLabel={formatCurrency(estimatedAmount)}
                                                 showAsLoader={silentLoadingStatus || currentDate === lastEditedTransactionId}
                                                 onConfirm={handleSubmission}
                    />
                )
            }
            {
                response.transactionList.map(({ transactionId, date, transactionAmount }) => {
                    return (
                        <EditableTransactionListItem key={date}
                                                     confirmButtonLabel={getContent('CONFIRM_CHANGE')}
                                                     amount={transactionAmount}
                                                     amountLabel={getContent('AMOUNT_SPENT_LABEL')}
                                                     date={date}
                                                     placeholderLabel={formatCurrency(estimatedAmount)}
                                                     showAsLoader={silentLoadingStatus || lastEditedTransactionId === transactionId}
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
                                         amount={estimatedAmount}
                                         amountLabel={getContent('AMOUNT_SPENT_LABEL')}
                                         date={response?.missingDate}
                                         placeholderLabel={formatCurrency(estimatedAmount)}
                                         showAsLoader={silentLoadingStatus || response?.missingDate === lastEditedTransactionId}
                                         onConfirm={handleSubmission}
            />
        </div>
    );
}