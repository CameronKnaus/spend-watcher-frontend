import { TransactionList } from 'Types/TransactionTypes';

interface TripDetailsResponse {
    transactionList: TransactionList;
}

// Currently not formatting data but can be changed in the future
export default function tripDetailsTransform({ data }: { data: TripDetailsResponse }) {
    return data;
}