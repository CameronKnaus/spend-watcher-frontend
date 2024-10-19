import TransactionRow from 'Components/TransactionRow';
import LoadingTransactionRow from 'Components/TransactionRow/LoadingTransactionRow';
import useContent from 'Hooks/useContent';
import useTripLinkedExpenses from 'Hooks/useTripLinkedExpenses/useTripLinkedExpenses';
import { DiscretionarySpendTransaction } from 'Types/Services/spending.model';
import { formatToMonthDay } from 'Util/Formatters/dateFormatters/dateFormatters';
import styles from './TripExpenseList.module.css';

type TripExpenseListPropTypes = {
    tripId: string;
    setTransactionToEdit: (transaction: DiscretionarySpendTransaction) => void;
};

export default function TripExpenseList({ tripId, setTransactionToEdit }: TripExpenseListPropTypes) {
    const getContent = useContent('trips');
    const { isLoading, expenseList } = useTripLinkedExpenses(tripId);

    return (
        <div>
            <div className={styles.linkedTransactionsLabel}>{getContent('linkedTransactions')}</div>
            {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                      <div className={styles.row} key={index}>
                          <LoadingTransactionRow />
                      </div>
                  ))
                : expenseList.map((transaction) => (
                      <div className={styles.row} key={transaction.transactionId}>
                          <TransactionRow
                              transactionId={transaction.transactionId}
                              category={transaction.category}
                              onClick={() => setTransactionToEdit(transaction)}
                              amountSpent={transaction.amountSpent}
                              note={transaction.note}
                              secondaryNote={formatToMonthDay(transaction.spentDate)}
                          />
                      </div>
                  ))}
        </div>
    );
}
