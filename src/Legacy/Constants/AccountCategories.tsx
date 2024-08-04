import { ReactElement } from 'react';
import { FaLandmark, FaMoneyBillWave, FaPiggyBank } from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';

export enum AccountCategory {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
    INVESTING = 'INVESTING',
    BONDS = 'BONDS',
}

export const AccountCategoryIconMapper: Record<AccountCategory, ReactElement> = {
    CHECKING: <FaMoneyBillWave />,
    SAVINGS: <FaPiggyBank />,
    INVESTING: <MdTrendingUp />,
    BONDS: <FaLandmark />,
};
