import { RecurringTransactionDetail } from 'Types/TransactionTypes';

interface RecurringTransactionHistoryRawData {
    hasThisMonthLogged: boolean;
    recurringSpendId: string;
    estimatedAmount: number;
    missingDate: string;
    transactionList: Array<RecurringTransactionDetail>;
}

// Currently not formatting data but can be changed in the future
export default function recurringTransactionHistoryTransform({ data }: { data: RecurringTransactionHistoryRawData }): RecurringTransactionHistoryRawData {
    return data;
}