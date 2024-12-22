import Currency from 'Components/Currency/Currency';
import LoadingInteractiveRow from 'Components/InteractiveRow/LoadingInteractiveRow';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import TransactionRow from 'Components/TransactionRow';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import useSpendingDetailsService from 'Hooks/useSpendingService';
import { isDiscretionaryTransactionId } from 'Util/SpendTransactionUtils/narrowIdType';
import styles from './TransactionsList.module.css';

export default function TransactionsList() {
    const getContent = useContent('trends');
    const { data: spendingData, isLoading } = useSpendingDetailsService();

    return (
        <ModuleContainer heading={getContent('transactionsTitle')} className={styles.module} elevation="low">
            <>
                {isLoading || !spendingData
                    ? Array.from({ length: 5 }).map((_, index) => <LoadingInteractiveRow key={index} />)
                    : Object.entries(spendingData.transactionsByDate)
                          // TODO: Have this list support more than just discretionary transactions (remove filter)
                          .filter(([_, datesTransactions]) => datesTransactions.discretionaryTotals.amount > 0)
                          .map(([dbDate, datesTransactions]) => (
                              <>
                                  <h3 className={styles.dateHeader}>
                                      {format(dbDate, 'MMM do')}
                                      <div className={styles.daysTotalAmount}>
                                          <Currency amount={-datesTransactions.discretionaryTotals.amount} isGainLoss />
                                      </div>
                                  </h3>
                                  <div className={styles.transactionGroup}>
                                      {datesTransactions.includedTransactions
                                          .filter(isDiscretionaryTransactionId)
                                          .map((transactionId) => (
                                              <TransactionRow
                                                  key={transactionId}
                                                  transactionId={transactionId}
                                                  category={spendingData.transactionDictionary[transactionId].category}
                                                  amountSpent={
                                                      spendingData.transactionDictionary[transactionId].amountSpent
                                                  }
                                                  note={spendingData.transactionDictionary[transactionId].note}
                                                  onClick={() => {}}
                                              />
                                          ))}
                                  </div>
                              </>
                          ))}
            </>
        </ModuleContainer>
    );
}
