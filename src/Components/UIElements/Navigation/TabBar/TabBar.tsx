import styles from './TabBar.module.css';
import devLogger from 'Util/DevTools/DevLogger';
import useContent, { ContentKeyAccessor, GroupKeyAccessor } from 'CustomHooks/useContent';
import { Color, SizeValue } from 'Types/StyleTypes';
import { Dispatch, SetStateAction } from 'react';

/*  tabMapping should be an array of keys for an enum like the following
        Example:
        const tabMapping = {
            MONTH: 'MONTH',
            YEAR: 'YEAR',
            MAX: 'MAX',
            SPECIFIC: 'SPECIFIC'
        };

    contentGroupKey: Should be a content group key that, if used with the useContent hook, should return plain text for a given tab enum and labelContentKey
* */

type TabBarPropTypes<T extends GroupKeyAccessor> = {
    tabMapping: Array<string>,
    contentGroupKey: T,
    labelContentKey: ContentKeyAccessor<T>,
    currentTab: string,
    setCurrentTab: Dispatch<SetStateAction<string>>,
    tabBorderColor: Color,
    activeTabColor: Color,
    inactiveTabColor: Color,
    tabTextColor: Color,
    tabMargin?: SizeValue
}

export default function TabBar<T extends GroupKeyAccessor>(
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
    }: TabBarPropTypes<T>
) {
    const getContent = useContent(contentGroupKey);

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
                                {getContent(tabType as ContentKeyAccessor<T>)}
                            </button>
                        );
                    })
                }
            </div>
        </>
    );
}