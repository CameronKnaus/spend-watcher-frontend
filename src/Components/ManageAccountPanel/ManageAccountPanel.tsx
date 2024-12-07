import { useQueryClient } from '@tanstack/react-query';
import EditAccountForm from 'Components/EditAccountForm/EditAccountForm';
import SpeedBump from 'Components/SlideUpPanel/Addons/SpeedBump/SpeedBump';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { Account } from 'Types/Services/accounts.model';
import ManageAccountBasePanel from './ManageAccountBasePanel';

type ManageAccountPanelPropTypes = {
    account: Account | null;
    onPanelClose: () => void;
};

export enum PanelTabs {
    BASE = 'BASE',
    EDIT_ACCOUNT = 'EDIT_ACCOUNT',
    SET_INACTIVE = 'SET_INACTIVE',
    DELETE_ACCOUNT = 'DELETE_ACCOUNT',
}

export default function ManageAccountPanel({ account, onPanelClose }: ManageAccountPanelPropTypes) {
    const queryClient = useQueryClient();
    const [selectedTab, setSelectedTab] = useState<PanelTabs>(PanelTabs.BASE);
    const getContent = useContent('accounts');

    // TODO:
    function invalidateQueries() {
        queryClient.invalidateQueries({
            queryKey: ['accounts'],
        });
    }

    function onClose() {
        setSelectedTab(PanelTabs.BASE);
        onPanelClose();
    }

    function getTitle() {
        if (!account) {
            return '';
        }

        const titleMapper = {
            [PanelTabs.BASE]: getContent('manageAccountHeader', [account.name]),
            [PanelTabs.EDIT_ACCOUNT]: getContent('editAccountHeader', [account.name]),
            [PanelTabs.SET_INACTIVE]: getContent('setInactiveHeader', [account.name]),
            [PanelTabs.DELETE_ACCOUNT]: getContent('deleteAccountHeader'),
        };

        return titleMapper[selectedTab];
    }

    function tabRenderer() {
        if (!account) {
            return null;
        }

        switch (selectedTab) {
            case PanelTabs.BASE:
                return <ManageAccountBasePanel setSelectedTab={setSelectedTab} onClose={onClose} />;
            case PanelTabs.EDIT_ACCOUNT:
                return (
                    <EditAccountForm
                        accountToEdit={account}
                        onSubmit={onClose}
                        onCancel={() => setSelectedTab(PanelTabs.BASE)}
                    />
                );
            case PanelTabs.SET_INACTIVE:
                return (
                    <SpeedBump
                        warningTitle={getContent('setAccountInactiveTitle', [account.name])}
                        warningDescription={getContent('setAccountInactiveDescription')}
                        proceedText={getContent('stopTrackingButton')}
                        onCancel={() => setSelectedTab(PanelTabs.BASE)}
                        onProceed={() => {
                            // seInactiveMutation.mutate({
                            //     accountId: account.id,
                            // });
                            onClose();
                        }}
                    />
                );
            case PanelTabs.DELETE_ACCOUNT:
                return (
                    <SpeedBump
                        warningTitle={getContent('deleteAccountTitle', [account.name])}
                        warningDescription={getContent('deleteAccountDescription')}
                        proceedText={getContent('deleteAccountButton')}
                        finalWarningText={getContent('deleteAccountFinalWarning')}
                        onCancel={() => setSelectedTab(PanelTabs.BASE)}
                        onProceed={() => {
                            // deleteMutation.mutate({
                            //     accountId: account.id,
                            // });
                            onClose();
                        }}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <SlideUpPanel
            title={getTitle()}
            isOpen={Boolean(account)}
            handlePanelWillClose={onClose}
            tagColor="var(--token-color-semantic-info)"
        >
            {tabRenderer()}
        </SlideUpPanel>
    );
}
