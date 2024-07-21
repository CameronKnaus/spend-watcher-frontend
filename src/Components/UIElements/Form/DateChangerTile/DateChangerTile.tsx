import useContent from '../../../../CustomHooks/useContent';
import DateContextChanger from '../DateContextChanger/DateContextChanger';
import ActionTile from '../../../Tiles/ActionTile/ActionTile';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import MONTH_NAMES from '../../../../Constants/MonthNames';
import DateRangeType from '../../../../Constants/DateRangeTypes';
import { DateType } from 'Types/DateTypes';

type DateChangerTilePropTypes = {
    startDate: Dayjs;
    minPossibleDate: DateType;
    maxPossibleDate: DateType;
    updateDateRange: (startDate: Dayjs, endDate: Dayjs, dateRangeType: DateRangeType) => void;
    minAllowedDate: Dayjs;
    dateRangeType: DateRangeType;
    resultsText: string;
};

export default function DateChangerTile({
    startDate,
    minPossibleDate,
    maxPossibleDate,
    updateDateRange = () => {
        /* NOOP */
    },
    minAllowedDate,
    dateRangeType = DateRangeType.MONTH,
    resultsText,
}: DateChangerTilePropTypes) {
    const [editMode, setEditMode] = useState(false);
    const getContent = useContent('DATE_CONTEXT_CHANGER');

    function getRangeText() {
        if (dateRangeType === DateRangeType.MONTH) {
            return `${MONTH_NAMES[startDate.month()]}, ${startDate.year()}`;
        }

        if (dateRangeType === DateRangeType.YEAR) {
            const currentYear = dayjs().year();
            if (startDate.year() === currentYear) {
                return getContent('YTD_SELECTED_LABEL', [currentYear]);
            }

            return startDate.year();
        }

        if (dateRangeType === DateRangeType.MAX) {
            return getContent('MAX_SELECTED_LABEL');
        }

        return '';
    }

    const dateContextTitle = (
        <>
            {resultsText}
            <br /> <div style={{ fontWeight: 'var(--fw-regular)', paddingTop: 4 }}>{getRangeText()}</div>
        </>
    );

    return (
        <>
            <ActionTile
                useShadow
                isInactive
                title={dateContextTitle}
                fallbackActionPrompt={getContent('CHANGE_CONTEXT')}
                callback={() => setEditMode((current) => !current)}
                options={{ paddingBelow: 0 }}
            />
            <DateContextChanger
                expanded={editMode}
                setExpanded={setEditMode}
                updateDateRange={updateDateRange}
                startingRangeOption={dateRangeType}
                minAllowedDate={minAllowedDate}
                minPossibleDate={minPossibleDate}
                maxPossibleDate={maxPossibleDate}
            />
        </>
    );
}
