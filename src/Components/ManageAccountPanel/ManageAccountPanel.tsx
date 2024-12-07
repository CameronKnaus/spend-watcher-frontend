import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import EditAccountForm from 'Components/EditAccountForm/EditAccountForm';
import PanelOptionButton from 'Components/SlideUpPanel/Addons/PanelOptionButton/PanelOptionButton';
import PanelOptionButtonContainer from 'Components/SlideUpPanel/Addons/PanelOptionButtonContainer/PanelOptionButtonContainer';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { Account } from 'Types/Services/accounts.model';

type ManageAccountPanelPropTypes = {
    account: Account;
    onPanelClose: () => void;
};

enum PanelTabs {
    BASE = 'BASE',
    EDIT_ACCOUNT = 'EDIT_ACCOUNT',
    DELETE_ACCOUNT = 'DELETE_ACCOUNT',
}

export default function ManageAccountPanel({ account, onPanelClose }: ManageAccountPanelPropTypes) {
    const [selectedTab, setSelectedTab] = useState<PanelTabs>(PanelTabs.BASE);
    const getContent = useContent('accounts');

    const titleMapper = {
        [PanelTabs.BASE]: getContent('manageAccountHeader', [account.name]),
        [PanelTabs.EDIT_ACCOUNT]: getContent('editAccountHeader', [account.name]),
        [PanelTabs.DELETE_ACCOUNT]: getContent('deleteAccountHeader'),
    };

    function tabRenderer() {
        switch (selectedTab) {
            case PanelTabs.BASE:
                return (
                    <>
                        <PanelOptionButtonContainer>
                            <PanelOptionButton onClick={() => setSelectedTab(PanelTabs.EDIT_ACCOUNT)}>
                                {getContent('editAccountOption')}
                            </PanelOptionButton>
                            <PanelOptionButton onClick={() => setSelectedTab(PanelTabs.DELETE_ACCOUNT)}>
                                {getContent('deleteAccountOption')}
                            </PanelOptionButton>
                        </PanelOptionButtonContainer>
                        <BottomSheet>
                            <CustomButton layout="full-width" variant="secondary" onClick={onPanelClose}>
                                {getContent('close')}
                            </CustomButton>
                        </BottomSheet>
                    </>
                );
            case PanelTabs.EDIT_ACCOUNT:
                return (
                    <EditAccountForm
                        accountToEdit={account}
                        onSubmit={() => {}}
                        onCancel={() => setSelectedTab(PanelTabs.BASE)}
                    />
                );
            case PanelTabs.DELETE_ACCOUNT:
                return <div>Delete account</div>;
            default:
                return null;
        }
    }

    return (
        <SlideUpPanel
            title={titleMapper[selectedTab]}
            isOpen
            handlePanelWillClose={() => {}}
            tagColor="var(--token-color-semantic-info)"
        >
            {tabRenderer()}
        </SlideUpPanel>
    );
}
