import SlideUpPanel, { ClosePanel } from '../Modal/SlideUpPanel';
import useContent from '../../../CustomHooks/useContent';
import React, { useState } from 'react';
import styles from '../../../Styles/Components/UIElements/Form/DateContextChanger.module.css';
import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import TabBar from '../Navigation/TabBar';

export const DATE_RANGE_OPTIONS = {
    MONTH: 'MONTH',
    YEAR: 'YEAR',
    YTD: 'YTD',
    SPECIFIC: 'SPECIFIC'
};

export default function DateContextChanger(
    {
        expanded,
        setExpanded,
        updateDateRange,
        minAllowedDate,
        defaultRangeOption = DATE_RANGE_OPTIONS.MONTH,
        syncSelectedRangeOption = () => { /* NOOP */ }
    }
) {
    const [selectedRangeOption, setSelectedRangeOption] = useState(defaultRangeOption);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getContent = useContent('DATE_CONTEXT_CHANGER');

    if(!expanded) {
        return null;
    }

    function handleMonthChange(newDate, closePanel) {
        if(selectedRangeOption !== DATE_RANGE_OPTIONS.MONTH) {
            return;
        }

        updateDateRange(newDate.startOf('month'), newDate.endOf('month'));

        syncSelectedRangeOption(selectedRangeOption);
        closePanel();
    }

    function handleYearChange(newDate, closePanel) {
        if(selectedRangeOption !== DATE_RANGE_OPTIONS.YEAR) {
            return;
        }

        const today = dayjs();
        if(selectedRangeOption === DATE_RANGE_OPTIONS.YEAR) {
            const startDate = dayjs(newDate.startOf('year'));

            let endDate;
            // If the selected date is the current year then use today as the end date
            if(newDate.year() === today.year()) {
                endDate = today;
            } else {
                endDate = newDate.endOf('year');
            }

            updateDateRange(startDate, endDate);

            syncSelectedRangeOption(selectedRangeOption);
            closePanel();
        }
    }

    function submitYTD() {
        // TODO: Check this
        updateDateRange(dayjs(dayjs().startOf('year')), dayjs());

        syncSelectedRangeOption(selectedRangeOption);
    }

    const isMonth = selectedRangeOption === DATE_RANGE_OPTIONS.MONTH;
    const isMonthOrYear = isMonth || selectedRangeOption === DATE_RANGE_OPTIONS.YEAR;
    const isYTD = selectedRangeOption === DATE_RANGE_OPTIONS.YTD;
    const isSpecificOrYTD = isYTD || selectedRangeOption === DATE_RANGE_OPTIONS.SPECIFIC;
    return (
        <SlideUpPanel hideTag
                      closeText={getContent('CANCEL')}
                      confirmText={isYTD ? getContent('CONFIRM') : ''}
                      forwardActionCallback={submitYTD}
                      onPanelClose={() => setExpanded(false)}
        >
            <ClosePanel.Consumer>
                {
                    ({ closePanel }) => (
                        <>
                            <div className={styles.tabBarContainer}>
                                <TabBar contentGroupKey='DATE_CONTEXT_CHANGER'
                                        labelContentKey='DATE_RANGE_TYPE'
                                        tabMapping={Object.values(DATE_RANGE_OPTIONS)}
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
                                            <DatePicker autoOk
                                                        disableFuture
                                                        disableToolbar
                                                        openTo='date'
                                                        variant='static'
                                                        views={isMonth ? ['year', 'month'] : ['year']}
                                                        value={selectedDate}
                                                        minDate={minAllowedDate}
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
                                isSpecificOrYTD && (
                                    <div className={styles.optionMessage}>
                                        {isYTD ? getContent('YTD_MESSAGE', [dayjs().format('YYYY')]) : getContent('SPECIFIC_MESSAGE')}
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