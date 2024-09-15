import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { RecurringSpendTransaction } from 'Types/Services/spending.model';
import styles from './DeleteRecurringSpeedBump.module.css';

type DeleteRecurringSpeedBumpPropTypes = {
    recurringSpendTransaction: RecurringSpendTransaction;
    handleCancel: () => void;
    onDeletion: () => void;
    onCancel?: () => void;
};

export default function DeleteRecurringSpeedBump({
    recurringSpendTransaction,
    handleCancel,
    onDeletion,
}: DeleteRecurringSpeedBumpPropTypes) {
    const getContent = useContent('recurringSpending');
    const getGeneralContent = useContent('general');

    function handleDeletion() {
        axios.post(SERVICE_ROUTES.postDeleteRecurringSpend, {
            recurringSpendId: recurringSpendTransaction.recurringSpendId,
        });
        onDeletion();
    }

    return (
        <div>
            <h3 className={styles.heading}>{getContent('deleteSpeedBumpHeader')}</h3>
            <p className={styles.description}>
                {getContent('deleteSpeedBumpDescription', [recurringSpendTransaction.recurringSpendName])}
            </p>
            <p className={styles.finalWarning}>{getContent('finalDeletionWarning')}</p>
            <BottomSheet>
                <CustomButton variant="secondary" onClick={handleCancel} layout="full-width">
                    {getGeneralContent('cancel')}
                </CustomButton>
                <CustomButton variant="tertiary" onClick={handleDeletion} layout="full-width">
                    {getGeneralContent('delete')}
                </CustomButton>
            </BottomSheet>
        </div>
    );
}
