import axios from 'axios';
import CustomButton from 'Components/CustomButton/CustomButton';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import useContent from 'Hooks/useContent';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { DiscretionaryAddRequestParams } from 'Types/Services/spending.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import ExpenseForm from './ExpenseForm';

type ExpenseFormPanelPropTypes = {
    setExpanded: Dispatch<SetStateAction<boolean>>;
    expanded: boolean;
};

export default function ExpenseFormPanel({ setExpanded, expanded }: ExpenseFormPanelPropTypes) {
    const getContent = useContent('transactions');
    const getGeneralContent = useContent('general');
    const hookForm = useForm<DiscretionaryAddRequestParams>();

    function onSubmit(submission: DiscretionaryAddRequestParams) {
        const payload = {
            ...submission,
            category: submission.category ?? SpendingCategory.OTHER,
        };

        axios.post(SERVICE_ROUTES.postDiscretionarySpending, payload);
        hookForm.reset();
        setExpanded(false);
    }

    return (
        <SlideUpPanel
            isOpen={expanded}
            title={getContent('newExpense')}
            tagColor="var(--token-color-semantic-expense)"
            bottomSheetContents={
                <>
                    <CustomButton variant="secondary" onClick={() => setExpanded(false)} layout="full-width">
                        {getGeneralContent('cancel')}
                    </CustomButton>
                    <CustomButton
                        isDisabled={hookForm.watch('amountSpent') == undefined}
                        variant="primary"
                        onClick={hookForm.handleSubmit(onSubmit)}
                        layout="full-width"
                    >
                        {getGeneralContent('submit')}
                    </CustomButton>
                </>
            }
        >
            <ExpenseForm onSubmit={onSubmit} {...hookForm} />
        </SlideUpPanel>
    );
}
