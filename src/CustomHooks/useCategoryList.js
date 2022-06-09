import React from 'react';
import useContent from '../CustomHooks/useContent';

export const useCategoryList = () => {
    const [categoryList, setCategoryList] = React.useState();
    const getContent = useContent();

    React.useEffect(() => {
        const get = (key) => getContent('CATEGORIES', key);

        setCategoryList([
            { name: get('OTHER'), code: 'OTHER' },
            { name: get('RESTAURANTS'), code: 'RESTAURANTS' },
            { name: get('DRINKS'), code: 'DRINKS' },
            { name: get('GROCERIES'), code: 'GROCERIES' },
            { name: get('ENTERTAINMENT'), code: 'ENTERTAINMENT' },
            { name: get('TRANSPORTATION'), code: 'TRANSPORTATION' },
            { name: get('VEHICLE'), code: 'VEHICLE' },
            { name: get('FUEL'), code: 'FUEL' },
            { name: get('BUSINESS'), code: 'BUSINESS' },
            { name: get('MATERIAL_ITEMS'), code: 'MATERIAL_ITEMS' },
            { name: get('TRAVEL'), code: 'TRAVEL' },
            { name: get('HEALTH'), code: 'HEALTH' },
            { name: get('CLOTHING'), code: 'CLOTHING' },
            { name: get('GIFTS'), code: 'GIFTS' },
            { name: get('EDUCATION'), code: 'EDUCATION' },
            { name: get('UTILITIES'), code: 'UTILITIES' },
            { name: get('HOUSING'), code: 'HOUSING' },
            { name: get('RECREATION'), code: 'RECREATION' },
            { name: get('PETS'), code: 'PETS' },
            { name: get('DATES'), code: 'DATES' },
            { name: get('INSURANCE'), code: 'INSURANCE' },
            { name: get('GAMES'), code: 'GAMES' }
        ]);
    }, [getContent]);

    return categoryList || [];
};