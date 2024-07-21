import SlideUpPanel, { ClosePanel } from '../../Modal/SlideUpPanel/SlideUpPanel';
import useContent from 'CustomHooks/useContent';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './DateContextChanger.module.css';
import { StaticDatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import TabBar from 'Components/UIElements/Navigation/TabBar/TabBar';
import DateRangeType from 'Constants/DateRangeTypes';
import { DateType } from 'Types/DateTypes';
import { EmptyCallback } from 'Types/QoLTypes';

type DateContextChangerPropTypes = {
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<boolean>>;
    updateDateRange: (startDate: Dayjs, endDate: Dayjs, dateRangeType: DateRangeType) => void;
    minAllowedDate: Dayjs;
    startingRangeOption?: DateRangeType;
    minPossibleDate: DateType;
    maxPossibleDate: DateType;
};

export default function DateContextChanger({
    expanded,
    setExpanded,
    updateDateRange,
    minAllowedDate,
    startingRangeOption = DateRangeType.MONTH,
    minPossibleDate,
    maxPossibleDate,
}: DateContextChangerPropTypes) {
    const [selectedRangeOption, setSelectedRangeOption] = useState(startingRangeOption);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getContent = useContent('DATE_CONTEXT_CHANGER');

    if (!expanded) {
        return null;
    }

    function handleMonthChange(newDate: Dayjs, closePanel: EmptyCallback) {
        if (selectedRangeOption !== DateRangeType.MONTH) {
            return;
        }

        updateDateRange(newDate.startOf('month'), newDate.endOf('month'), DateRangeType.MONTH);
        closePanel();
    }

    function handleYearChange(newDate: Dayjs, closePanel: EmptyCallback) {
        if (selectedRangeOption !== DateRangeType.YEAR) {
            return;
        }

        const today = dayjs();
        if (selectedRangeOption === DateRangeType.YEAR) {
            const startDate = dayjs(newDate.startOf('year'));

            let endDate;
            // If the selected date is the current year then use today as the end date
            if (newDate.year() === today.year()) {
                endDate = today;
            } else {
                endDate = newDate.endOf('year');
            }

            updateDateRange(startDate, endDate, DateRangeType.YEAR);

            closePanel();
        }
    }

    function submitMax() {
        updateDateRange(dayjs(minPossibleDate), dayjs(maxPossibleDate), DateRangeType.MAX);
    }

    const isMonth = selectedRangeOption === DateRangeType.MONTH;
    const isMonthOrYear = isMonth || selectedRangeOption === DateRangeType.YEAR;
    const isMax = selectedRangeOption === DateRangeType.MAX;
    const isSpecificOrMax = isMax || selectedRangeOption === DateRangeType.SPECIFIC;
    return (
        <SlideUpPanel
            hideTag
            closeText={getContent('CANCEL')}
            confirmText={isMax ? getContent('CONFIRM') : ''}
            forwardActionCallback={submitMax}
            onPanelClose={() => setExpanded(false)}
        >
            <ClosePanel.Consumer>
                {(closePanel) => (
                    <>
                        <div className={styles.tabBarContainer}>
                            <TabBar
                                contentGroupKey="DATE_CONTEXT_CHANGER"
                                labelContentKey="DATE_RANGE_TYPE"
                                tabMapping={Object.values(DateRangeType)}
                                currentTab={selectedRangeOption}
                                setCurrentTab={setSelectedRangeOption}
                                activeTabColor="var(--theme-jungle-green)"
                                inactiveTabColor="var(--theme-jungle-green-dark)"
                                tabTextColor="var(--theme-bright-text-color)"
                                tabBorderColor="var(--theme-jungle-green)"
                            />
                        </div>
                        {/*  Date picker logic */}
                        {isMonthOrYear && (
                            <>
                                <label htmlFor="date-input" className={styles.label}>
                                    {getContent(isMonth ? 'CURRENT_MONTH' : 'CURRENT_YEAR') +
                                        ' ' +
                                        selectedDate.format(isMonth ? 'MM/YYYY' : 'YYYY')}
                                </label>
                                <div className={styles.datePickerBox}>
                                    <StaticDatePicker
                                        disableFuture
                                        views={isMonth ? ['year', 'month'] : ['year']}
                                        value={selectedDate}
                                        minDate={minAllowedDate}
                                        className={styles.textInput}
                                        slotProps={{
                                            actionBar: {
                                                actions: [],
                                            },
                                            toolbar: {
                                                hidden: true,
                                            },
                                        }}
                                        onMonthChange={(newDate) => {
                                            handleMonthChange(newDate, closePanel);
                                        }}
                                        onYearChange={(newDate) => {
                                            handleYearChange(newDate, closePanel);
                                        }}
                                        onChange={(value) => {
                                            value && setSelectedDate(value);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        {isSpecificOrMax && (
                            <div className={styles.optionMessage}>
                                {getContent(isMax ? 'MAX_MESSAGE' : 'SPECIFIC_MESSAGE')}
                            </div>
                        )}
                    </>
                )}
            </ClosePanel.Consumer>
        </SlideUpPanel>
    );
}
