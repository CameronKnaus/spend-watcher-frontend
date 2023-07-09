import SlideUpPanel, { ClosePanel } from '../../Modal/SlideUpPanel/SlideUpPanel';
import useContent from 'CustomHooks/useContent';
import React, { useState } from 'react';
import styles from './DateContextChanger.module.css';
import { StaticDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TabBar from 'Components/UIElements/Navigation/TabBar/TabBar';
import DATE_RANGE_TYPES from 'Constants/DateRangeTypes';

export default function DateContextChanger(
    {
        expanded,
        setExpanded,
        updateDateRange,
        minAllowedDate,
        startingRangeOption = DATE_RANGE_TYPES.MONTH,
        minPossibleDate,
        maxPossibleDate
    }
) {
    const [selectedRangeOption, setSelectedRangeOption] = useState(startingRangeOption);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getContent = useContent('DATE_CONTEXT_CHANGER');

    if(!expanded) {
        return null;
    }

    function handleMonthChange(newDate, closePanel) {
        if(selectedRangeOption !== DATE_RANGE_TYPES.MONTH) {
            return;
        }

        updateDateRange(newDate.startOf('month'), newDate.endOf('month'), DATE_RANGE_TYPES.MONTH);
        closePanel();
    }

    function handleYearChange(newDate, closePanel) {
        if(selectedRangeOption !== DATE_RANGE_TYPES.YEAR) {
            return;
        }

        const today = dayjs();
        if(selectedRangeOption === DATE_RANGE_TYPES.YEAR) {
            const startDate = dayjs(newDate.startOf('year'));

            let endDate;
            // If the selected date is the current year then use today as the end date
            if(newDate.year() === today.year()) {
                endDate = today;
            } else {
                endDate = newDate.endOf('year');
            }

            updateDateRange(startDate, endDate, DATE_RANGE_TYPES.YEAR);

            closePanel();
        }
    }

    function submitMax() {
        updateDateRange(dayjs(minPossibleDate), dayjs(maxPossibleDate), DATE_RANGE_TYPES.MAX);
    }

    const isMonth = selectedRangeOption === DATE_RANGE_TYPES.MONTH;
    const isMonthOrYear = isMonth || selectedRangeOption === DATE_RANGE_TYPES.YEAR;
    const isMax = selectedRangeOption === DATE_RANGE_TYPES.MAX;
    const isSpecificOrMax = isMax || selectedRangeOption === DATE_RANGE_TYPES.SPECIFIC;
    return (
        <SlideUpPanel hideTag
                      closeText={getContent('CANCEL')}
                      confirmText={isMax ? getContent('CONFIRM') : ''}
                      forwardActionCallback={submitMax}
                      onPanelClose={() => setExpanded(false)}
        >
            <ClosePanel.Consumer>
                {
                    (closePanel) => (
                        <>
                            <div className={styles.tabBarContainer}>
                                <TabBar contentGroupKey='DATE_CONTEXT_CHANGER'
                                        labelContentKey='DATE_RANGE_TYPE'
                                        tabMapping={Object.values(DATE_RANGE_TYPES)}
                                        currentTab={selectedRangeOption}
                                        setCurrentTab={setSelectedRangeOption}
                                        activeTabColor='var(--theme-jungle-green)'
                                        inactiveTabColor='var(--theme-jungle-green-dark)'
                                        tabTextColor='var(--theme-bright-text-color)'
                                        tabBorderColor='var(--theme-jungle-green)'
                                />
                            </div>
                            {/*  Date picker logic */}
                            {
                                isMonthOrYear && (
                                    <>
                                        <label htmlFor='date-input' className={styles.label}>
                                            {getContent(isMonth ? 'CURRENT_MONTH' : 'CURRENT_YEAR') + ' ' + selectedDate.format(isMonth ? 'MM/YYYY' : 'YYYY')}
                                        </label>
                                        <div className={styles.datePickerBox}>
                                            <StaticDatePicker disableFuture
                                                              views={isMonth ? ['year', 'month'] : ['year']}
                                                              value={selectedDate}
                                                              minDate={minAllowedDate}
                                                              className={styles.textInput}
                                                              slotProps={{
                                                                actionBar: {
                                                                    actions: []
                                                                },
                                                                toolbar: {
                                                                    hidden: true
                                                                }
                                                              }}
                                                              onMonthChange={(newDate) => {
                                                                handleMonthChange(newDate, closePanel);
                                                              }}
                                                              onYearChange={(newDate) => {
                                                                handleYearChange(newDate, closePanel);
                                                              }}
                                                              onChange={setSelectedDate}
                                            />
                                        </div>
                                    </>
                                )
                            }
                            {
                                isSpecificOrMax && (
                                    <div className={styles.optionMessage}>
                                        {getContent(isMax ? 'MAX_MESSAGE' : 'SPECIFIC_MESSAGE')}
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </ClosePanel.Consumer>
        </SlideUpPanel>
    );
}