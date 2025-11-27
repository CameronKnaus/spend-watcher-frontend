import BottomSheet from 'Components/BottomSheet/BottomSheet';
import Currency from 'Components/Currency/Currency';
import CustomButton from 'Components/CustomButton/CustomButton';
import EditSpendForm from 'Components/DiscretionarySpendForm/EditSpendForm';
import InteractiveRow from 'Components/InteractiveRow/InteractiveRow';
import SpendingCategoryIcon from 'Components/Shared/Icons/SpendingCategoryIcon';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import type { DiscretionarySpendTransaction, RecurringSpendTransaction } from 'Types/Services/spending.model';
import type { SpendingCategory } from 'Types/SpendingCategory';
import { formatToMonthDayYear } from 'Util/Formatters/dateFormatters/dateFormatters';
import styles from './CategoryTransactionListPanel.module.css';

interface CategoryTransactionListPanelPropTypes {
    /** # For Resetting transaction to edit state */
    key: SpendingCategory | undefined;
    category?: SpendingCategory;
    transaction?: DiscretionarySpendTransaction;
    transactionDictionary: Record<string, DiscretionarySpendTransaction | RecurringSpendTransaction>;
    onPanelClose: () => void;
}

export default function CategoryTransactionListPanel({
    category,
    transactionDictionary,
    onPanelClose,
}: CategoryTransactionListPanelPropTypes) {
    const getContent = useContent('general');
    const getCategoryLabel = useContent('SPENDING_CATEGORIES');
    const [transactionToEdit, setTransactionToEdit] = useState<DiscretionarySpendTransaction>();

    return (
        <SlideUpPanel
            isOpen={Boolean(category)}
            title={category ? getCategoryLabel(category) : ''}
            tagColor={`var(--theme-color-spend-category-${category})`}
            handlePanelWillClose={onPanelClose}
        >
            {transactionToEdit ? (
                <EditSpendForm
                    transactionToEdit={transactionToEdit}
                    onCancel={() => {
                        setTransactionToEdit(undefined);
                    }}
                    onSubmit={() => {
                        setTransactionToEdit(undefined);
                    }}
                />
            ) : (
                <>
                    <div className={styles.listContainer}>
                        {Object.values(transactionDictionary)
                            .filter((transaction) => transaction.category === category)
                            .map((transaction) => {
                                if (transaction.isRecurring) {
                                    return (
                                        <div
                                            key={transaction.transactionId}
                                            className={styles.placeholderRecurringContainer}
                                        >
                                            <span
                                                style={{ width: '100%' }}
                                            >{`${formatToMonthDayYear(transaction.spentDate)} - (Recurring placeholder)`}</span>
                                            <span>{transaction.recurringSpendName}</span>
                                            <Currency amount={-transaction.amountSpent} isGainLoss />
                                        </div>
                                    );
                                }

                                // Discretionary
                                return (
                                    <InteractiveRow
                                        key={transaction.transactionId}
                                        icon={<SpendingCategoryIcon category={transaction.category} size={36} />}
                                        primaryLabel={getCategoryLabel(transaction.category)}
                                        primaryDataPoint={<Currency amount={-transaction.amountSpent} isGainLoss />}
                                        secondaryDataPoint={transaction.note}
                                        secondaryLabel={formatToMonthDayYear(transaction.spentDate)}
                                        onClick={() => {
                                            setTransactionToEdit(transaction);
                                        }}
                                    />
                                );
                            })}
                    </div>
                    <BottomSheet>
                        <CustomButton variant="secondary" onClick={onPanelClose} layout="full-width">
                            {getContent('close')}
                        </CustomButton>
                    </BottomSheet>
                </>
            )}
        </SlideUpPanel>
    );
}
