import React from 'react';
import styles from '../Styles/Containers/MyMoney.module.css';
import useContent from '../CustomHooks/useContent';
import ActionTile from '../Components/Tiles/ActionTile';
import Link from '../Components/UIElements/Link';
import AccountForm from '../Components/MyMoney/AccountForm';

export default function MyMoney({ callForRefresh }) {
    const [newAccountPanelOpen, setNewAccountPanelOpen] = React.useState(false);

    const getContent = useContent();
    const text = (key, args) => getContent('MY_MONEY', key, args);

    return (
        <>
            <h2 className={`header-text ${styles.title}`}>
                {text('MY_MONEY')}
            </h2>
            <ActionTile useShadow
                        title={text('TOTAL_VALUE_TITLE')}
                        value={0}
                        ariaValue={text('TOTAL_VALUE_ARIA', [0])}
                        actionPrompt={text('SEE_TRENDS')}
                        options={{ showValueAbove: true }}
            />
            <Link useChevron
                  text={text('ADD_ACCOUNT')}
                  textAlign='center'
                  customClass={styles.linkContainer}
                  onClickCallback={() => setNewAccountPanelOpen(true)}
            />
            {
                newAccountPanelOpen && <AccountForm onPanelClose={() => setNewAccountPanelOpen(false)} onSubmission={callForRefresh} />
            }
        </>
    );
}