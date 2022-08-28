import useContent from '../../../CustomHooks/useContent';
import DateContextChanger, { DATE_RANGE_OPTIONS } from './DateContextChanger';
import ActionTile from '../../Tiles/ActionTile';
import { useState } from 'react';
import dayjs from 'dayjs';
import MONTH_NAMES from '../../../Constants/MonthNames';

export default function DateChangerTile(
    { startDate,
        endDate,
        updateDateRange = () => { /* NOOP */ },
        minAllowedDate,
        defaultRangeOption = DATE_RANGE_OPTIONS.MONTH, resultsText }
) {
    const [selectedDateRangeOption, setSelectedDateRangeOption] = useState(defaultRangeOption);
    const [editMode, setEditMode] = useState(false);
    const getContent = useContent('DATE_CONTEXT_CHANGER');

    function getRangeText() {
        if(selectedDateRangeOption === DATE_RANGE_OPTIONS.MONTH) {
            return `${MONTH_NAMES[startDate.month()]}, ${startDate.year()}`;
        }

        const currentYear = dayjs().year();
        if(selectedDateRangeOption === DATE_RANGE_OPTIONS.YTD) {
            return getContent('YTD_SELECTED_LABEL', [currentYear]);
        }

        if(selectedDateRangeOption === DATE_RANGE_OPTIONS.YEAR) {
            if(startDate.year() === currentYear) {
                return getContent('YTD_SELECTED_LABEL', [currentYear]);
            }

            return startDate.year();
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
            <ActionTile useShadow title={dateContextTitle}
                        fallbackActionPrompt={getContent('CHANGE_CONTEXT')}
                        callback={() => setEditMode(current => !current)}
                        options={{ paddingBelow: 0 }}
            />
            <DateContextChanger expanded={editMode}
                                setExpanded={setEditMode}
                                startDate={startDate}
                                endDate={endDate}
                                updateDateRange={updateDateRange}
                                syncSelectedRangeOption={setSelectedDateRangeOption}
                                minAllowedDate={minAllowedDate}
            />
        </>
    );
}