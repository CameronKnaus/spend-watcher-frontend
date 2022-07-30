import React from 'react';
import useContent from '../CustomHooks/useContent';
import { ACCOUNT_CATEGORIES, SPENDING_CATEGORIES } from '../Constants/categories';

// Supported category lists
const AVAILABLE_LISTS = {
    transactions: {
        name: 'SPENDING_CATEGORIES',
        list: SPENDING_CATEGORIES
    },
    accounts: {
        name: 'ACCOUNT_CATEGORIES',
        list: ACCOUNT_CATEGORIES
    }
};

export const useCategoryList = (listType) => {
    if(!AVAILABLE_LISTS[listType]) {
        throw new Error('Expected category listType of "transactions" | "accounts"');
    }

    const [categoryList, setCategoryList] = React.useState([]);
    const getContent = useContent();

    React.useEffect(() => {
        const CATEGORIES = AVAILABLE_LISTS[listType].list;
        const contentKeys = Object.keys(CATEGORIES);
        const get = (key) => {
            return getContent(AVAILABLE_LISTS[listType].name, key);
        };

        setCategoryList(contentKeys.map((key) => {
            return { name: get(key), code: key };
        }));
    }, [getContent, listType]);

    return categoryList;
};