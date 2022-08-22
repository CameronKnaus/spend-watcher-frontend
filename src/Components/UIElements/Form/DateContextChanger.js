import SlideUpPanel, { ClosePanel } from '../Modal/SlideUpPanel';
import useContent from '../../../CustomHooks/useContent';
import React, { useState } from 'react';
import styles from '../../../Styles/Components/UIElements/Form/DateContextChanger.module.css';
import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';

export const DATE_RANGE_OPTIONS = {
    MONTH: 'MONTH',
    YEAR: 'YEAR',
    YTD: 'YTD',
    SPECIFIC: 'SPECIFIC'
};

export default function DateContextChanger({ expanded,
    setExpanded,
    setStartDate,
    setEndDate,
    defaultRangeOption = DATE_RANGE_OPTIONS.MONTH,
    syncSelectedRangeOption = () => { /* NOOP */ } }) {
    const [selectedRangeOption, setSelectedRangeOption] = useState(defaultRangeOption);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getContent = useContent();
    const text = (key, args) => getContent('DATE_CONTEXT_CHANGER', key, args);

    if(!expanded) {
        return null;
    }

    function handleMonthChange(newDate, closePanel) {
        if(selectedRangeOption !== DATE_RANGE_OPTIONS.MONTH) {
            return;
        }

        setEndDate(newDate.endOf('month'));
        setStartDate(newDate.startOf('month'));

        syncSelectedRangeOption(selectedRangeOption);
        closePanel();
    }

    function handleYearChange(newDate, closePanel) {
        if(selectedRangeOption !== DATE_RANGE_OPTIONS.YEAR) {
            return;
        }

        const today = dayjs();
        if(selectedRangeOption === DATE_RANGE_OPTIONS.YEAR) {
            setStartDate(dayjs(newDate.startOf('year')));

            // TODO maybe not needed
            // If the selected date is the current year then use today as the end date
            if(newDate.year() === today.year()) {
                setEndDate(today);
            } else {
                setEndDate(newDate.endOf('year'));
            }

            syncSelectedRangeOption(selectedRangeOption);
            closePanel();
        }
    }

    function submitYTD() {
        setStartDate(dayjs(dayjs().startOf('year')));
        setEndDate(dayjs());

        syncSelectedRangeOption(selectedRangeOption);
    }

    const isMonth = selectedRangeOption === DATE_RANGE_OPTIONS.MONTH;
    const isMonthOrYear = isMonth || selectedRangeOption === DATE_RANGE_OPTIONS.YEAR;
    const isYTD = selectedRangeOption === DATE_RANGE_OPTIONS.YTD;
    const isSpecificOrYTD = isYTD || selectedRangeOption === DATE_RANGE_OPTIONS.SPECIFIC;
    return (
        <SlideUpPanel hideTag
                      closeText={text('CANCEL')}
                      confirmText={isYTD ? text('CONFIRM') : ''}
                      forwardActionCallback={submitYTD}
                      onPanelClose={() => setExpanded(false)}
        >
            <ClosePanel.Consumer>
                {
                    ({ closePanel }) => (
                        <>
                            {/* Date Range Tabs */}
                            <label className={styles.label}>
                                {text('DATE_RANGE_TYPE')}
                            </label>
                            <div className={styles.tabContainer}>
                                {
                                    Object.values(DATE_RANGE_OPTIONS).map(rangeType => (
                                        <button key={rangeType}
                                                className={`${styles.tab} ${selectedRangeOption === rangeType ? styles.active : ''}`}
                                                onClick={() => setSelectedRangeOption(rangeType)}
                                        >
                                            {text(rangeType)}
                                        </button>
                                    ))
                                }
                            </div>
                            {/*  Date picker logic */}
                            {
                                isMonthOrYear && (
                                    <>
                                        <label htmlFor='date-input' className={styles.label}>
                                            {text(isMonth ? 'CURRENT_MONTH' : 'CURRENT_YEAR') + ' ' + selectedDate.format(isMonth ? 'MM/YYYY' : 'YYYY')}
                                        </label>
                                        <div className={styles.datePickerBox}>
                                            <DatePicker autoOk
                                                        disableFuture
                                                        disableToolbar
                                                        openTo='date'
                                                        variant='static'
                                                        views={isMonth ? ['year', 'month'] : ['year']}
                                                        value={selectedDate}
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
                                        {isYTD ? text('YTD_MESSAGE', [dayjs().format('YYYY')]) : text('SPECIFIC_MESSAGE')}
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