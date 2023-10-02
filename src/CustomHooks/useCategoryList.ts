import useContent from 'CustomHooks/useContent';
import { ACCOUNT_CATEGORIES, SPENDING_CATEGORIES } from 'Constants/categories';
import { ManagedTransactionType } from 'Types/TransactionTypes';
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

export const useCategoryList = (listType: ProductCategoryType) => {
    const [categoryList, setCategoryList] = useState<Array<ManagedTransactionType>>([]);
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
};