import useContent from '../CustomHooks/useContent';
import NavigationalBanner from '../Components/UIElements/Navigation/NavigationalBanner';
import ActionTile from '../Components/Tiles/ActionTile';
import styles from '../Styles/Containers/SpendingSummary.module.css';

export default function SpendingSummary() {
    const getContent = useContent();
    const text = (key, args) => getContent('SPENDING_SUMMARY', key, args);

    const dateContextTitle = (
        <>
            {text('RESULTS')}
            <br />
            {' '}
            <span style={{ fontWeight: 'var(--fw-regular)' }}>
                September, 2022
            </span>
        </>
    );

    return (
        <>
            <NavigationalBanner title={text('TITLE')} />
            <div className={`${styles.gutter} ${styles.dateContextContainer}`}>
                <ActionTile useShadow title={dateContextTitle}
                            fallbackActionPrompt={text('CHANGE_CONTEXT')}
                />
            </div>
        </>
    );
}