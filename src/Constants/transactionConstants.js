import { FaCannabis, FaCar, FaGasPump, FaGift, FaTshirt, FaHome, FaHeart, FaDollarSign } from 'react-icons/fa';
import { IoIosBeer, IoIosCart, IoIosAirplane, IoMdBrush } from 'react-icons/io';
import { MdFastfood,
    MdMovieFilter,
    MdTrain,
    MdBusinessCenter,
    MdHealthAndSafety,
    MdSchool,
    MdWaterDrop,
    MdPets,
    MdShield,
    MdShoppingBag } from 'react-icons/md';

import { IoGameController } from 'react-icons/io5';

export const CATEGORY_ICONS = {
    RESTAURANTS: <MdFastfood />,
    DRINKS: <IoIosBeer />,
    GROCERIES: <IoIosCart />,
    ENTERTAINMENT: <MdMovieFilter />,
    TRANSPORTATION: <MdTrain />,
    VEHICLE: <FaCar />,
    FUEL: <FaGasPump />,
    BUSINESS: <MdBusinessCenter />,
    MATERIAL_ITEMS: <MdShoppingBag />,
    TRAVEL: <IoIosAirplane />,
    HEALTH: <MdHealthAndSafety />,
    CLOTHING: <FaTshirt />,
    GIFTS: <FaGift />,
    EDUCATION: <MdSchool />,
    UTILITIES: <MdWaterDrop />,
    HOUSING: <FaHome />,
    RECREATION: <FaCannabis />,
    PETS: <MdPets />,
    DATES: <FaHeart />,
    INSURANCE: <MdShield />,
    GAMES: <IoGameController />,
    HOBBY: <IoMdBrush />,
    OTHER: <FaDollarSign />
};

export const CATEGORY_COLORS = {
    RESTAURANTS: 'var(--theme-mango)',
    DRINKS: 'var(--theme-queen-blue-dark)',
    GROCERIES: 'var(--theme-pistachio)',
    ENTERTAINMENT: 'var(--theme-jungle-green-dark)',
    TRANSPORTATION: 'var(--theme-maize-crayola-dark)',
    VEHICLE: 'var(--theme-orange)',
    FUEL: 'var(--theme-orange-dark)',
    BUSINESS: 'var(--theme-maize-crayola)',
    MATERIAL_ITEMS: 'var(--theme-red)',
    TRAVEL: 'var(--theme-jungle-green-pale)',
    HEALTH: 'var(--theme-red-dark)',
    CLOTHING: 'var(--theme-mango-dark)',
    GIFTS: 'var(--theme-yellow-pale)',
    EDUCATION: 'var(--theme-celadon-blue)',
    UTILITIES: 'var(--theme-celadon-blue-pale)',
    HOUSING: 'var(--theme-queen-blue)',
    RECREATION: 'var(--theme-pistachio-dark)',
    PETS: 'var(--theme-yellow-orange)',
    DATES: 'var(--theme-red-pale)',
    INSURANCE: 'var(--theme-celadon-blue-dark)',
    GAMES: 'var(--theme-jungle-green)',
    HOBBY: 'var(--theme-orange-pale)',
    OTHER: 'var(--theme-steel-teal)'
};