import { spendCategoryColorMapper, spendCategoryIconMapper } from 'Components/Shared/Icons/spendCategoryIconMapper';
import useContent from 'Hooks/useContent';
import { FaMoneyBillWave } from 'react-icons/fa';
import { Trip } from 'Types/Services/trips.model';
import { SpendingCategory } from 'Types/SpendingCategory';
import { formatToMonthDay, formatToMonthDayYear } from 'Util/Formatters/dateFormatters/dateFormatters';
import { TripModuleDataPoint } from '../TripModuleDataPoint/TripModuleDataPoint';
import styles from './TripModule.module.css';

type TripModulePropTypes = {
    trip: Trip;
};

export default function TripModule({ trip }: TripModulePropTypes) {
    const getContent = useContent('trips');
    const getCategoryLabel = useContent('SPENDING_CATEGORIES');
    const isSameYear = trip.startDate.slice(0, 4) === trip.endDate.slice(0, 4);

    const dateLabel = isSameYear
        ? `${formatToMonthDay(trip.startDate)} - ${formatToMonthDayYear(trip.endDate)}`
        : `${formatToMonthDayYear(trip.startDate)} - ${formatToMonthDayYear(trip.endDate)}`;

    return (
        <div className={`${styles.module} background-secondary-elevation-low`}>
            <h2 className={styles.tripName}>{trip.tripName}</h2>
            <div className={styles.tripDates}>{dateLabel}</div>
            <div className={styles.spendTotalDataPoints}>
                {/* Airfare total */}
                <TripModuleDataPoint
                    label={getCategoryLabel(SpendingCategory.AIRFARE)}
                    icon={spendCategoryIconMapper[SpendingCategory.AIRFARE]}
                    iconBackgroundColor={spendCategoryColorMapper[SpendingCategory.AIRFARE]}
                    amount={-99.99}
                />
                {/* Lodging total */}
                <TripModuleDataPoint
                    label={getCategoryLabel(SpendingCategory.LODGING)}
                    icon={spendCategoryIconMapper[SpendingCategory.LODGING]}
                    iconBackgroundColor={spendCategoryColorMapper[SpendingCategory.LODGING]}
                    amount={-99.99}
                />
                {/* Discretionary total */}
                <TripModuleDataPoint
                    label={getContent('discretionary')}
                    icon={spendCategoryIconMapper[SpendingCategory.OTHER]}
                    iconBackgroundColor={spendCategoryColorMapper[SpendingCategory.OTHER]}
                    amount={-99.99}
                />
                {/* Total */}
                <TripModuleDataPoint
                    label={getContent('total')}
                    icon={<FaMoneyBillWave />}
                    iconBackgroundColor={'var(--theme-color-secondary-100)'}
                    amount={-99.99}
                />
            </div>
        </div>
    );
}
