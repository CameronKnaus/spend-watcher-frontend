import useContent from '../../CustomHooks/useContent';
import NavigationalBanner from '../../Components/UIElements/Navigation/NavigationalBanner/NavigationalBanner';
import React, { useEffect, useState } from 'react';
import DateChangerTile from '../../Components/UIElements/Form/DateChangerTile/DateChangerTile';
import styles from './SpendingBreakdown.module.css';
import SERVICE_ROUTES from '../../Constants/ServiceRoutes';
import useDateRange from '../../CustomHooks/useDateRange';
import TabBar from '../../Components/UIElements/Navigation/TabBar/TabBar';
import { useParams } from 'react-router';
import SpendingSummary from '../../Containers/SpendingSummary/SpendingSummary';
import SpendingHistory from '../../Containers/SpendingHistory/SpendingHistory';
import DateContextShifter from '../../Components/UIElements/Form/DateContextShifter/DateContextShifter';
import { useIsMobile } from '../../Util/IsMobileContext';
import clsx from 'clsx';
import ToggleSwitch from 'Components/UIElements/Form/TogleSwitch/ToggleSwitch';
import DateRangeType from 'Constants/DateRangeTypes';
import DateRangeLabel from 'Components/UIElements/Informational/DateRangeLabel/DateRangeLabel';
import useSpendingBreakdown from 'CustomHooks/ServiceHooks/useSpendingBreakdown';
import dayjs from 'dayjs';
import { DateType } from 'Types/DateTypes';
import { SpendingCategoryType } from 'Constants/categories';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { transactionsDateRangeQueryKey } from 'Util/QueryKeys';

export enum TAB_ENUM {
    SUMMARY_TAB = 'SUMMARY_TAB',
    HISTORY_TAB = 'HISTORY_TAB',
}

const defaultTabMap: Record<string, TAB_ENUM> = {
    summary: TAB_ENUM.SUMMARY_TAB,
    history: TAB_ENUM.HISTORY_TAB,
};

export default function SpendingBreakdown() {
    const getContent = useContent('SPENDING_BREAKDOWN');
    const isMobile = useIsMobile();

    const { dateRange, dateRangeType, updateDateRange, shiftYearInContext, shiftMonthInContext } = useDateRange();
    const urlParams = useParams();

    const [currentTab, setCurrentTab] = useState(defaultTabMap[`${urlParams.defaultTab}`] || TAB_ENUM.SUMMARY_TAB);
    const [minSupportedDate, setMinSupportedDate] = useState(dayjs('01/01/0001'));
    const [filterCategory, setFilterCategory] = useState<SpendingCategoryType | ''>('');
    const [includeRecurringTransactions, setIncludeRecurringTransactions] = useState(false);

    // Get the earliest spending logged to set date range handler min range
    // TODO: Handle error scenario here
    const { data: dateRangeResponse } = useQuery({
        queryKey: [transactionsDateRangeQueryKey],
        queryFn: () => {
            return axios.get(SERVICE_ROUTES.transactionDateRange);
        },
        select: ({ data }) => ({ minDate: data.minDate, maxDate: data.maxDate }),
    });

    useEffect(() => {
        if (!dateRangeResponse || !dateRangeResponse.minDate) {
            return;
        }

        setMinSupportedDate(dayjs(dateRangeResponse.minDate));
    }, [dateRangeResponse]);

    const serviceArgs = {
        startDate: dateRange.startDate.format() as DateType,
        endDate: dateRange.endDate.format() as DateType,
        includeRecurringTransactions,
        showAllData: dateRangeType === DateRangeType.MAX,
    };

    const { spendingDataErrorOccurred, spendingDataLoading, spendingBreakdown } = useSpendingBreakdown(serviceArgs);

    if (!dateRangeResponse || spendingDataLoading || !spendingBreakdown) {
        return <div>loading...</div>;
    }

    // TODO: Proper error handling
    if (spendingDataErrorOccurred) {
        return <div>Error Occurred</div>;
    }

    const dateManagement = (
        <div className={clsx(styles.gutter, isMobile ? styles.mobileDateManager : styles.desktopDateManager)}>
            <DateChangerTile
                resultsText={getContent('RESULTS_SHOWN')}
                updateDateRange={updateDateRange}
                //  endDate={dateRange.endDate}
                startDate={dateRange.startDate}
                minAllowedDate={minSupportedDate}
                dateRangeType={dateRangeType}
                minPossibleDate={dateRangeResponse.minDate}
                maxPossibleDate={dateRangeResponse.maxDate}
            />
            {!isMobile && (
                <DateRangeLabel
                    dateRangeType={dateRangeType}
                    startDate={spendingBreakdown.startDate}
                    endDate={spendingBreakdown.endDate}
                />
            )}
            {dateRangeType !== DateRangeType.MAX && (
                <div className={styles.dateContextShifterContainer}>
                    <DateContextShifter
                        dateRangeType={dateRangeType}
                        shiftYearInContext={shiftYearInContext}
                        shiftMonthInContext={shiftMonthInContext}
                        minAllowedDate={minSupportedDate}
                        endDate={dateRange.endDate}
                        startDate={dateRange.startDate}
                    />
                </div>
            )}
            <div className={styles.toggleSwitchContainer}>
                <ToggleSwitch
                    spaceBetween
                    labelText={getContent('INCLUDE_RECURRING')}
                    toggleOnState={() => setIncludeRecurringTransactions((current) => !current)}
                    activeColor="var(--theme-queen-blue-pale)"
                    onState={includeRecurringTransactions}
                />
            </div>
        </div>
    );

    const summaryWithProps = (
        <SpendingSummary
            spendingBreakdown={spendingBreakdown}
            setCurrentTab={setCurrentTab}
            setFilterCategory={setFilterCategory}
            totalTransactionsPerCategory={spendingBreakdown.totalTransactionsPerCategory}
        />
    );

    const historyWithProps = (
        <SpendingHistory
            transactionsList={spendingBreakdown.transactionsGroupedByDate}
            noTransactions={spendingBreakdown.noTransactions}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            totalTransactionsPerCategory={spendingBreakdown.totalTransactionsPerCategory}
            finalTotalTransactions={spendingBreakdown.finalTotalTransactions}
        />
    );

    if (isMobile) {
        // XS Mobile experience
        return (
            <>
                <NavigationalBanner
                    title={getContent(
                        currentTab === TAB_ENUM.SUMMARY_TAB ? 'SUMMARY_BANNER_TITLE' : 'HISTORY_BANNER_TITLE',
                    )}
                />
                {dateManagement}
                <DateRangeLabel
                    dateRangeType={dateRangeType}
                    startDate={spendingBreakdown.startDate}
                    endDate={spendingBreakdown.endDate}
                />
                <div className={styles.tabContainer}>
                    <TabBar
                        contentGroupKey="SPENDING_BREAKDOWN"
                        labelContentKey="TAB_BAR_LABEL"
                        tabMapping={Object.values(TAB_ENUM)}
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                        activeTabColor="var(--theme-celadon-blue)"
                        inactiveTabColor="var(--theme-celadon-blue-dark)"
                        tabTextColor="var(--theme-bright-text-color)"
                        tabBorderColor="var(--theme-celadon-blue)"
                        tabMargin="1.5rem"
                    />
                </div>
                <div className={styles.softBackground}>
                    {currentTab === TAB_ENUM.SUMMARY_TAB && summaryWithProps}
                    {currentTab === TAB_ENUM.HISTORY_TAB && historyWithProps}
                </div>
            </>
        );
    }

    // Desktop experience
    return (
        <>
            <NavigationalBanner
                title={getContent(
                    currentTab === TAB_ENUM.SUMMARY_TAB ? 'SUMMARY_BANNER_TITLE' : 'HISTORY_BANNER_TITLE',
                )}
            />
            <div className={`${styles.desktopSideBar} low-shadow`}>
                {dateManagement}
                {historyWithProps}
            </div>
            <div className={styles.desktopSummaryContainer}>{summaryWithProps}</div>
        </>
    );
}
