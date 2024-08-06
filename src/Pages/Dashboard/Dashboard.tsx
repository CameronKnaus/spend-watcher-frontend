import styles from './Dashboard.module.css';
import { format } from 'date-fns';
import MonthsSpendingHighlights from './MonthsSpendingHighlights/MonthsSpendingHighlights';
import CustomButton from 'Components/CustomButton/CustomButton';
import { useState } from 'react';
import SlideUpPanel from 'Components/SlideUpPanel/SlideUpPanel';

export default function Dashboard() {
    const [expanded, setExpanded] = useState(false);
    const currentMonth = format(new Date(), 'LLLL');

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.spendingSectionTitle}>{`${currentMonth} overview`}</h2>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.spendingGrid}>
                        <MonthsSpendingHighlights />
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <CustomButton
                        variant="tertiary"
                        text="Log Expense"
                        layout="full-width"
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    />
                    <SlideUpPanel
                        isOpen={expanded}
                        onBackButtonClick={() => setExpanded(false)}
                        title="New expense"
                        tagColor="var(--token-color-semantic-expense)"
                        onPanelClose={() => setExpanded(false)}
                    >
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST</h1>
                        <h1>TEST ASd</h1>
                    </SlideUpPanel>
                </div>
            </div>
        </div>
    );
}
