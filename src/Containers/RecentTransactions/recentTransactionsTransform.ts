import { TransactionList } from 'Types/TransactionTypes';

interface RawRecentTransactions {
    transactions: TransactionList;
}

// Currently not formatting data but can be changed in the future
export default function spendingTransform({ data }: { data: RawRecentTransactions }) {
    return data;
}