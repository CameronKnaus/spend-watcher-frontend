import CustomButton from 'Components/CustomButton/CustomButton';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import useContent from 'Hooks/useContent';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import ExpenseForm, { ExpenseFormInputs } from './ExpenseForm';

type ExpenseFormPanelPropTypes = {
    setExpanded: Dispatch<SetStateAction<boolean>>;
    expanded: boolean;
};

export default function ExpenseFormPanel({ setExpanded, expanded }: ExpenseFormPanelPropTypes) {
    const getContent = useContent('transactions');
    const hookForm = useForm<ExpenseFormInputs>();

    function onSubmit(submission: ExpenseFormInputs) {
        console.log(submission);
    }

    return (
        <SlideUpPanel
            isOpen={expanded}
            title={getContent('newExpense')}
            tagColor="var(--token-color-semantic-expense)"
            bottomSheetContents={
                <>
                    <CustomButton variant="secondary" onClick={() => setExpanded(false)} layout="full-width">
                        {getContent('clearSelection')}
                    </CustomButton>
                    <CustomButton
                        isDisabled={hookForm.watch('amount') == undefined}
                        variant="primary"
                        onClick={hookForm.handleSubmit(onSubmit)}
                        layout="full-width"
                    >
                        {getContent('submit')}
                    </CustomButton>
                </>
            }
        >
            <ExpenseForm onSubmit={onSubmit} {...hookForm} />
        </SlideUpPanel>
    );
}
