import useContent from '../../../CustomHooks/useContent';
import DateContextChanger from './DateContextChanger';
import ActionTile from '../../Tiles/ActionTile';
import { useState } from 'react';
import dayjs from 'dayjs';
import MONTH_NAMES from '../../../Constants/MonthNames';
import DATE_RANGE_TYPES from '../../../Constants/DateRangeTypes';

export default function DateChangerTile(
    { startDate,
        endDate,
        minPossibleDate,
        maxPossibleDate,
        updateDateRange = () => { /* NOOP */ },
        minAllowedDate,
        dateRangeType = DATE_RANGE_TYPES.MONTH,
        resultsText }
) {
    const [editMode, setEditMode] = useState(false);
    const getContent = useContent('DATE_CONTEXT_CHANGER');

    function getRangeText() {
        if(dateRangeType === DATE_RANGE_TYPES.MONTH) {
            return `${MONTH_NAMES[startDate.month()]}, ${startDate.year()}`;
        }

        if(dateRangeType === DATE_RANGE_TYPES.YEAR) {
            const currentYear = dayjs().year();
            if(startDate.year() === currentYear) {
                return getContent('YTD_SELECTED_LABEL', [currentYear]);
            }

            return startDate.year();
        }

        if(dateRangeType === DATE_RANGE_TYPES.MAX) {
            return getContent('MAX_SELECTED_LABEL');
        }

        return '';
    }

    const dateContextTitle = (
        <>
            {resultsText}
            <br />
            {' '}
            <div style={{ fontWeight: 'var(--fw-regular)', paddingTop: 4 }}>
                {getRangeText()}
            </div>
        </>
    );

    return (
        <>
            <ActionTile useShadow
                        isInactive
                        title={dateContextTitle}
                        fallbackActionPrompt={getContent('CHANGE_CONTEXT')}
                        callback={() => setEditMode(current => !current)}
                        options={{ paddingBelow: 0 }}
            />
            <DateContextChanger expanded={editMode}
                                setExpanded={setEditMode}
                                startDate={startDate}
                                endDate={endDate}
                                updateDateRange={updateDateRange}
                                startingRangeOption={dateRangeType}
                                minAllowedDate={minAllowedDate}
                                minPossibleDate={minPossibleDate}
                                maxPossibleDate={maxPossibleDate}
            />
        </>
    );
}