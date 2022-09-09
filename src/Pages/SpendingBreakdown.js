import useContent from '../CustomHooks/useContent';
import NavigationalBanner from '../Components/UIElements/Navigation/NavigationalBanner';
import React, { useEffect, useState } from 'react';
import DateChangerTile from '../Components/UIElements/Form/DateChangerTile';
import styles from '../Styles/Pages/SpendingBreakdown.module.css';
import useFetch from '../CustomHooks/useFetch';
import SERVICE_ROUTES from '../Constants/ServiceRoutes';
import useDateRange from '../CustomHooks/useDateRange';
import TabBar from '../Components/UIElements/Navigation/TabBar';
import { useParams } from 'react-router';
import SpendingSummary from '../Containers/SpendingSummary';
import axios from 'axios';
import SpendingHistory from '../Containers/SpendingHistory';
import DateContextShifter from '../Components/UIElements/Form/DateContextShifter';

export const TAB_ENUM = {
    SUMMARY_TAB: 'SUMMARY_TAB',
    HISTORY_TAB: 'HISTORY_TAB'
};

const defaultTabMap = {
    summary: TAB_ENUM.SUMMARY_TAB,
    history: TAB_ENUM.HISTORY_TAB
};

export default function SpendingBreakdown() {
    const getContent = useContent('SPENDING_BREAKDOWN');

    const {
        dateRange,
        dateRangeType,
        updateDateRange,
        shiftYearInContext,
        shiftMonthInContext
    } = useDateRange();
    const urlParams = useParams();

    const [currentTab, setCurrentTab] = useState(defaultTabMap[urlParams.defaultTab] || TAB_ENUM.SUMMARY_TAB);
    const [minSupportedDate, setMinSupportedDate] = useState('01/01/0001');
    const [spendingBreakdown, setSpendingBreakdown] = useState();
    const [error, setError] = useState();
    const [filterCategory, setFilterCategory] = useState({ name: '', code: '' });

    // Get the earliest spending logged to set date range handler min range
    const { response: dateRangeResponse } = useFetch(SERVICE_ROUTES.transactionDateRange, true);
    useEffect(() => {
        if(!dateRangeResponse || !dateRangeResponse.minDate) {
            return;
        }

        setMinSupportedDate(dateRangeResponse.minDate);
    }, [dateRangeResponse]);

    useEffect(() => {
        setSpendingBreakdown(null);
        const args = {
            startDate: dateRange.startDate.format(),
            endDate: dateRange.endDate.format()
        };

        axios.post(SERVICE_ROUTES.spendingBreakdown, args)
            .then(({ data }) => {
                setSpendingBreakdown({
                    finalTotalSpent: data.finalTotalSpent,
                    categoryTotals: data.totalsByCategory,
                    transactionsList: data.transactionsGroupedByDate
                });
            })
            .catch(setError);
    }, [dateRange]);

    if(!spendingBreakdown) {
        return (
            <div>
                loading...
            </div>
        );
    }

    // TODO: Proper error handling
    if(error) {
        return (
            <div>
                {error}
            </div>
        );
    }

    return (
        <>
            <NavigationalBanner title={getContent(currentTab === TAB_ENUM.SUMMARY_TAB ? 'SUMMARY_BANNER_TITLE' : 'HISTORY_BANNER_TITLE')} />
            <div className={styles.gutter}>
                <DateChangerTile resultsText={getContent('RESULTS_SHOWN')}
                                 updateDateRange={updateDateRange}
                                 endDate={dateRange.endDate}
                                 startDate={dateRange.startDate}
                                 minAllowedDate={minSupportedDate}
                />
                <div className={styles.dateContextShifterContainer}>
                    <DateContextShifter dateRangeType={dateRangeType}
                                        shiftYearInContext={shiftYearInContext}
                                        shiftMonthInContext={shiftMonthInContext}
                                        minAllowedDate={minSupportedDate}
                                        endDate={dateRange.endDate}
                                        startDate={dateRange.startDate}
                    />
                </div>
            </div>
            <div className={styles.tabContainer}>
                <TabBar contentGroupKey='SPENDING_BREAKDOWN'
                        labelContentKey='TAB_BAR_LABEL'
                        tabMapping={Object.values(TAB_ENUM)}
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                        activeTabColor='var(--theme-celadon-blue)'
                        inactiveTabColor='var(--theme-celadon-blue-dark)'
                        tabTextColor='var(--theme-bright-text-color)'
                        tabBorderColor='var(--theme-celadon-blue)'
                        tabMargin='1.5rem'
                />
            </div>
            {currentTab === TAB_ENUM.SUMMARY_TAB && (
                <SpendingSummary spendingBreakdown={spendingBreakdown}
                                 setCurrentTab={setCurrentTab}
                                 setFilterCategory={setFilterCategory}
                />
            )}
            {currentTab === TAB_ENUM.HISTORY_TAB && (
                <SpendingHistory transactionsList={spendingBreakdown.transactionsList}
                                 filterCategory={filterCategory}
                                 setFilterCategory={setFilterCategory}
                />
            )}
        </>
    );
}