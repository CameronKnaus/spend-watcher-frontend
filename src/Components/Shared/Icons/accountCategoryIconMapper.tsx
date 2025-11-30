import type { AccountCategory } from 'Types/accountTypes';
import type { ReactElement } from 'react';
import { FaLandmark, FaMoneyBillWave, FaPiggyBank } from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';

const accountCategoryIconMapper: Record<AccountCategory, ReactElement> = {
    CHECKING: <FaMoneyBillWave />,
    SAVINGS: <FaPiggyBank />,
    INVESTING: <MdTrendingUp />,
    BONDS: <FaLandmark />,
};

export default accountCategoryIconMapper;
