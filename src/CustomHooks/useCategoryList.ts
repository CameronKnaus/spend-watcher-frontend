import useContent from 'CustomHooks/useContent';
import { ACCOUNT_CATEGORIES, AccountCategoryType, SPENDING_CATEGORIES, SpendingCategoryType } from 'Constants/categories';
import { useState, useEffect } from 'react';

// Supported category lists
const AVAILABLE_LISTS: Record<ProductCategoryType, { name: string, list: any }> = {
    transactions: {
        name: 'SPENDING_CATEGORIES',
        list: SPENDING_CATEGORIES
    },
    accounts: {
        name: 'ACCOUNT_CATEGORIES',
        list: ACCOUNT_CATEGORIES
    }
};

export type ProductCategoryType = 'transactions' | 'accounts';

export function useCategoryList<T extends SpendingCategoryType | AccountCategoryType>(listType: ProductCategoryType): Array<T> {
    const [categoryList, setCategoryList] = useState<Array<T>>([]);
    const getSpendingContent = useContent('SPENDING_CATEGORIES');
    const getMyMoneyContent = useContent('ACCOUNT_CATEGORIES');

    useEffect(() => {
        const CATEGORIES = AVAILABLE_LISTS[listType].list;
        const contentKeys = Object.keys(CATEGORIES);
        const getContent = listType === 'transactions' ? getSpendingContent : getMyMoneyContent;

        // @ts-ignore
        setCategoryList(contentKeys.map((key) => {
            return {
                // @ts-ignore
                name: getContent(key),
                code: key
            };
        }));
    }, [getMyMoneyContent, getSpendingContent, listType]);

    return categoryList;
}