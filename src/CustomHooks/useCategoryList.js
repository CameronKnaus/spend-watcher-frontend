import React from 'react';
import useContent from '../CustomHooks/useContent';

export const useCategoryList = () => {
    const [categoryList, setCategoryList] = React.useState([]);
    const getContent = useContent();

    React.useEffect(() => {
        const get = (key) => getContent('CATEGORIES', key);

        setCategoryList([
            { name: get('OTHER'), code: 'OTHER' },
            { name: get('RESTAURANTS'), code: 'RESTAURANTS' },
            { name: get('ENTERTAINMENT'), code: 'ENTERTAINMENT' },
            { name: get('GROCERIES'), code: 'GROCERIES' },
            { name: get('BUSINESS'), code: 'BUSINESS' },
            { name: get('CLOTHING'), code: 'CLOTHING' },
            { name: get('DATES'), code: 'DATES' },
            { name: get('DRINKS'), code: 'DRINKS' },
            { name: get('EDUCATION'), code: 'EDUCATION' },
            { name: get('FUEL'), code: 'FUEL' },
            { name: get('GAMES'), code: 'GAMES' },
            { name: get('GIFTS'), code: 'GIFTS' },
            { name: get('HEALTH'), code: 'HEALTH' },
            { name: get('HOUSING'), code: 'HOUSING' },
            { name: get('INSURANCE'), code: 'INSURANCE' },
            { name: get('MATERIAL_ITEMS'), code: 'MATERIAL_ITEMS' },
            { name: get('PETS'), code: 'PETS' },
            { name: get('RECREATION'), code: 'RECREATION' },
            { name: get('TRANSPORTATION'), code: 'TRANSPORTATION' },
            { name: get('TRAVEL'), code: 'TRAVEL' },
            { name: get('UTILITIES'), code: 'UTILITIES' },
            { name: get('VEHICLE'), code: 'VEHICLE' }
        ]);
    }, [getContent]);

    return categoryList;
};