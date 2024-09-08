import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import CustomButton from 'Components/CustomButton/CustomButton';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaTrashAlt } from 'react-icons/fa';
import { DiscretionarySpendTransaction, v1DiscretionaryAddSchema } from 'Types/Services/spending.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import ExpenseForm, { ExpenseFormAttributes } from './DiscretionaryExpenseForm';
import styles from './DiscretionaryExpenseForm.module.css';

type DiscretionarySpendPanelPropTypes = {
    isOpen: boolean;
    onPanelClose: () => void;
    transactionToEdit?: DiscretionarySpendTransaction;
};

export default function DiscretionarySpendPanel({
    isOpen,
    onPanelClose,
    // If transactionToEdit is provided, the panel will be in edit mode
    transactionToEdit,
}: DiscretionarySpendPanelPropTypes) {
    const editMode = Boolean(transactionToEdit);
    const getContent = useContent('transactions');
    const getGeneralContent = useContent('general');
    const form = useForm<ExpenseFormAttributes>({
        resolver: zodResolver(v1DiscretionaryAddSchema),
        mode: 'onChange', // Least performant but not a concern here
        defaultValues: {
            category: SpendingCategory.OTHER,
        },
    });

    useEffect(() => {
        form.reset(transactionToEdit);
    }, [transactionToEdit, form]);

    function closePanel() {
        form.reset();
        onPanelClose();
    }

    function onSubmit(submission: ExpenseFormAttributes) {
        if (editMode) {
            // Editing existing transaction
            const payload = {
                ...submission,
                transactionId: transactionToEdit?.transactionId,
            };

            axios.post(SERVICE_ROUTES.postEditDiscretionarySpending, payload);
        } else {
            // New transaction
            const payload = {
                ...submission,
            };

            axios.post(SERVICE_ROUTES.postAddDiscretionarySpending, payload);
        }

        closePanel();
    }

    return (
        <SlideUpPanel
            isOpen={isOpen}
            title={getContent(editMode ? 'editExpense' : 'newExpense')}
            tagColor="var(--token-color-semantic-expense)"
            bottomSheetContents={
                <>
                    <CustomButton variant="secondary" onClick={closePanel} layout="full-width">
                        {getGeneralContent('cancel')}
                    </CustomButton>
                    <CustomButton
                        isDisabled={!form.formState.isValid}
                        variant="primary"
                        onClick={form.handleSubmit(onSubmit)}
                        layout="full-width"
                    >
                        {getGeneralContent('submit')}
                    </CustomButton>
                </>
            }
        >
            <>
                <ExpenseForm onSubmit={onSubmit} {...form} />
                {editMode && (
                    <button className={styles.deleteLink} onClick={() => {}}>
                        {getContent('deleteExpense')}
                        <FaTrashAlt />
                    </button>
                )}
            </>
        </SlideUpPanel>
    );
}
