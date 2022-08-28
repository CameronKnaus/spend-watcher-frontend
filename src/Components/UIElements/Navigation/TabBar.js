import styles from '../../../Styles/Components/UIElements/Navigation/TabBar.module.css';
import React from 'react';
import devLogger from '../../../Util/DevLogger';
import useContent from '../../../CustomHooks/useContent';

/*  tabMapping should be an object enumerating available tabs.
        Example:
        const tabMapping = {
            MONTH: 'MONTH',
            YEAR: 'YEAR',
            YTD: 'YTD',
            SPECIFIC: 'SPECIFIC'
        };

    contentGroupKey: Should be a content group key that, if used with the useContent hook, should return plain text for a given tab enum and labelContentKey
* */
export default function TabBar(
    {
        tabMapping,
        contentGroupKey,
        labelContentKey,
        currentTab,
        setCurrentTab,
        tabBorderColor,
        activeTabColor,
        inactiveTabColor,
        tabTextColor,
        tabMargin = '0px'
    }
) {
    const getContent = useContent(contentGroupKey);

    if(!tabBorderColor || !activeTabColor || !tabTextColor || !inactiveTabColor) {
        devLogger.error('Missing color options for TabBar component');
        return null;
    }

    if(!contentGroupKey) {
        devLogger.error('Missing content group key for TabBar component');
        return null;
    }

    const tabContainerStyle = {
        borderBottom: `4px solid ${tabBorderColor}`,
        padding: `0px ${tabMargin}`
    };

    return (
        <>
            {
                labelContentKey && (
                    <label className={styles.label} style={{ paddingLeft: tabMargin }}>
                        {getContent(labelContentKey)}
                    </label>
                )
            }
            <div className={styles.tabContainer} style={tabContainerStyle}>
                {
                    tabMapping.map(tabType => {
                        const isCurrentTab = currentTab === tabType;
                        const tabStyle = {
                            color: tabTextColor,
                            backgroundColor: isCurrentTab ? activeTabColor : inactiveTabColor
                        };

                        return (
                            <button key={tabType}
                                    className={`${styles.tab} ${isCurrentTab ? styles.active : ''}`}
                                    style={tabStyle}
                                    onClick={() => setCurrentTab(tabType)}
                            >
                                {getContent(tabType)}
                            </button>
                        );
                    })
                }
            </div>
        </>
    );
}