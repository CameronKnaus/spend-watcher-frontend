import Currency from 'Components/Currency/Currency';
import dashboardStyles from '../Dashboard.module.css';
import { clsx } from 'clsx';

export default function MonthsSpendingHighlights() {
    return (
        <>
            <div className={clsx([dashboardStyles.summaryTile, 'background-secondary-elevation-high'])}>
                <h3>Total spent</h3>
                <Currency className="font-heading-medium font-thin" value={-5432.13} isGainLoss />
            </div>
            <div className={clsx([dashboardStyles.summaryTile, 'background-secondary-elevation-medium'])}>
                <h3>Discretionary total</h3>
                <Currency className="font-heading-medium font-thin" value={-5432.13} isGainLoss />
            </div>
            <div className={clsx([dashboardStyles.summaryTile, 'background-secondary-elevation-low'])}>
                <h3>Recurring total</h3>
                <Currency className="font-heading-medium font-thin" value={-5432.13} isGainLoss />
            </div>
        </>
    );
}
