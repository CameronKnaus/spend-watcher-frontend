import { FaCannabis,
    FaCar,
    FaGasPump,
    FaGift,
    FaTshirt,
    FaHome,
    FaHeart,
    FaDollarSign,
    FaMoneyBillWave,
    FaPlaneDeparture,
    FaLandmark } from 'react-icons/fa';
import { IoIosBeer, IoIosCart, IoIosAirplane, IoMdBrush, IoIosTrendingUp } from 'react-icons/io';
import { MdFastfood,
    MdMovieFilter,
    MdTrain,
    MdBusinessCenter,
    MdHealthAndSafety,
    MdSchool,
    MdWaterDrop,
    MdPets,
    MdShield,
    MdShoppingBag,
    MdSavings,
    MdFitnessCenter,
    MdContentCut } from 'react-icons/md';

import { IoGameController } from 'react-icons/io5';

export const SPENDING_CATEGORIES = {
    RESTAURANTS: {
        icon: <MdFastfood />,
        color: 'var(--theme-mango)'
    },
    DRINKS: {
        icon: <IoIosBeer />,
        color: 'var(--theme-queen-blue-dark)'
    },
    GROCERIES: {
        icon: <IoIosCart />,
        color: 'var(--theme-pistachio)'
    },
    ENTERTAINMENT: {
        icon: <MdMovieFilter />,
        color: 'var(--theme-jungle-green-dark)'
    },
    TRANSPORTATION: {
        icon: <MdTrain />,
        color: 'var(--theme-maize-crayola-dark)'
    },
    VEHICLE: {
        icon: <FaCar />,
        color: 'var(--theme-orange)'
    },
    FUEL: {
        icon: <FaGasPump />,
        color: 'var(--theme-orange-dark)'
    },
    FITNESS: {
        icon: <MdFitnessCenter />,
        color: 'var(--theme-queen-blue-pale)'
    },
    GROOMING: {
        icon: <MdContentCut />,
        color: 'var(--theme-pistachio-pale)'
    },
    BUSINESS: {
        icon: <MdBusinessCenter />,
        color: 'var(--theme-maize-crayola)'
    },
    MATERIAL_ITEMS: {
        icon: <MdShoppingBag />,
        color: 'var(--theme-red)'
    },
    TRAVEL: {
        icon: <IoIosAirplane />,
        color: 'var(--theme-jungle-green-pale)'
    },
    HEALTH: {
        icon: <MdHealthAndSafety />,
        color: 'var(--theme-red-dark)'
    },
    CLOTHING: {
        icon: <FaTshirt />,
        color: 'var(--theme-mango-dark)'
    },
    GIFTS: {
        icon: <FaGift />,
        color: 'var(--theme-yellow-pale)'
    },
    EDUCATION: {
        icon: <MdSchool />,
        color: 'var(--theme-celadon-blue)'
    },
    UTILITIES: {
        icon: <MdWaterDrop />,
        color: 'var(--theme-celadon-blue-pale)'
    },
    HOUSING: {
        icon: <FaHome />,
        color: 'var(--theme-queen-blue)'
    },
    CANNABIS: {
        icon: <FaCannabis />,
        color: 'var(--theme-pistachio-dark)'
    },
    PETS: {
        icon: <MdPets />,
        color: 'var(--theme-yellow-orange)'
    },
    DATES: {
        icon: <FaHeart />,
        color: 'var(--theme-red-pale)'
    },
    INSURANCE: {
        icon: <MdShield />,
        color: 'var(--theme-celadon-blue-dark)'
    },
    GAMES: {
        icon: <IoGameController />,
        color: 'var(--theme-jungle-green)'
    },
    HOBBY: {
        icon: <IoMdBrush />,
        color: 'var(--theme-orange-pale)'
    },
    OTHER: {
        icon: <FaDollarSign />,
        color: 'var(--theme-steel-teal)'
    }
};

export const ACCOUNT_CATEGORIES = {
    CHECKING: {
        icon: <FaMoneyBillWave />,
        color: 'var(--theme-celadon-blue)'
    },
    SAVINGS: {
        icon: <MdSavings />,
        color: 'var(--theme-red-pale)'
    },
    INVESTING: {
        icon: <IoIosTrendingUp />,
        color: 'var(--theme-jungle-green)'
    },
    BONDS: {
        icon: <FaLandmark />,
        color: 'var(--theme-yellow-orange)'
    }
};

const CATEGORIES = {
    ...SPENDING_CATEGORIES,
    ...ACCOUNT_CATEGORIES,
    TRIP: {
        icon: <FaPlaneDeparture />,
        color: 'var(--theme-jungle-green-pale)'
    }
};
export default CATEGORIES;