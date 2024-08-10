import Currency from 'Components/Currency/Currency';
import dashboardStyles from '../Dashboard.module.css';
import { clsx } from 'clsx';
import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';

export default function MonthsSpendingHighlights() {
    return (
        <>
            <ModuleContainer className={clsx([dashboardStyles.summaryTile, 'background-secondary-elevation-medium'])}>
                <h3>Total spent</h3>
                <Currency className="font-heading-medium font-thin" value={-5432.13} isGainLoss />
            </ModuleContainer>
            <ModuleContainer className={clsx([dashboardStyles.summaryTile, 'background-secondary-elevation-low'])}>
                <h3>Discretionary total</h3>
                <Currency className="font-heading-medium font-thin" value={-5432.13} isGainLoss />
            </ModuleContainer>
            <ModuleContainer className={clsx([dashboardStyles.summaryTile, 'background-secondary-elevation-low'])}>
                <h3>Recurring total</h3>
                <Currency className="font-heading-medium font-thin" value={-5432.13} isGainLoss />
            </ModuleContainer>
        </>
    );
}
