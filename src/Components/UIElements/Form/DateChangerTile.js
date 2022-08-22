import useContent from '../../../CustomHooks/useContent';
import DateContextChanger, { DATE_RANGE_OPTIONS } from './DateContextChanger';
import ActionTile from '../../Tiles/ActionTile';
import { useState } from 'react';
import dayjs from 'dayjs';
import MONTH_NAMES from '../../../Constants/MonthNames';

// TODO Fix linter making this look bad
export default function DateChangerTile(
    { startDate,
        setStartDate,
        endDate,
        setEndDate,
        defaultRangeOption = DATE_RANGE_OPTIONS.MONTH, resultsText }) {
    const [selectedDateRangeOption, setSelectedDateRangeOption] = useState(defaultRangeOption);
    const [editMode, setEditMode] = useState(false);
    const getContent = useContent();
    const text = (key, args) => getContent('DATE_CONTEXT_CHANGER', key, args);

    function getRangeText() {
        if(selectedDateRangeOption === DATE_RANGE_OPTIONS.MONTH) {
            return `${MONTH_NAMES[startDate.month()]}, ${startDate.year()}`;
        }

        const currentYear = dayjs().year();
        if(selectedDateRangeOption === DATE_RANGE_OPTIONS.YTD) {
            return text('YTD_SELECTED_LABEL', [currentYear]);
        }

        if(selectedDateRangeOption === DATE_RANGE_OPTIONS.YEAR) {
            if(startDate.year() === currentYear) {
                return text('YTD_SELECTED_LABEL', [currentYear]);
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
                        fallbackActionPrompt={text('CHANGE_CONTEXT')}
                        callback={() => setEditMode(current => !current)}
            />
            <DateContextChanger expanded={editMode}
                                setExpanded={setEditMode}
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                syncSelectedRangeOption={setSelectedDateRangeOption}
            />
        </>
    );
}