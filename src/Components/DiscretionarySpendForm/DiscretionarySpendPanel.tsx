import axios from 'axios';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { FaTrashAlt } from 'react-icons/fa';
import { DiscretionarySpendTransaction } from 'Types/Services/spending.model';
import DiscretionarySpendForm from './DiscretionarySpendForm';
import styles from './DiscretionarySpendForm.module.css';

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
    function handleDelete() {
        if (!transactionToEdit) {
            return;
        }

        axios.post(SERVICE_ROUTES.postDeleteDiscretionarySpending, {
            transactionId: transactionToEdit.transactionId,
        });
        onPanelClose();
    }

    return (
        <SlideUpPanel
            isOpen={isOpen}
            title={getContent(editMode ? 'editExpense' : 'newExpense')}
            tagColor="var(--token-color-semantic-expense)"
        >
            <>
                <DiscretionarySpendForm transactionToEdit={transactionToEdit} onPanelClose={onPanelClose} />
                {editMode && (
                    <button className={styles.deleteLink} onClick={handleDelete}>
                        {getContent('deleteExpense')}
                        <FaTrashAlt />
                    </button>
                )}
            </>
        </SlideUpPanel>
    );
}
