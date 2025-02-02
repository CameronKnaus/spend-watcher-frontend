import AccountsList from 'Components/AccountsList/AccountsList';
import AddAccountButton from 'Components/AddAccountButton/AddAccountButton';
import PageContainer from 'Components/PageContainer/PageContainer';
import useContent from 'Hooks/useContent';
import styles from './Savings.module.css';

export default function Savings() {
    const getContent = useContent('savings');

    return (
        <PageContainer pageTitle={getContent('pageTitle')}>
            <div className={styles.tile}>
                <AccountsList />
            </div>
            <AddAccountButton />
        </PageContainer>
    );
}
