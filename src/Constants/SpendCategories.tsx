import { ReactElement } from 'react';
import {
    FaCannabis,
    FaCar,
    FaCookieBite,
    FaDollarSign,
    FaGasPump,
    FaGift,
    FaHome,
    FaMoneyBillAlt,
    FaTshirt,
} from 'react-icons/fa';
import {
    MdBrush,
    MdBusinessCenter,
    MdContentCut,
    MdFastfood,
    MdFitnessCenter,
    MdHealing,
    MdHotel,
    MdLocalAirport,
    MdLocalGroceryStore,
    MdMovieFilter,
    MdPets,
    MdSchool,
    MdShield,
    MdShoppingBag,
    MdSportsBar,
    MdTrain,
    MdVideogameAsset,
    MdWaterDrop,
} from 'react-icons/md';

export enum SpendingCategory {
    AIRFARE = 'AIRFARE',
    BUSINESS = 'BUSINESS',
    CANNABIS = 'CANNABIS',
    CLOTHING = 'CLOTHING',
    DRINKS = 'DRINKS',
    EDUCATION = 'EDUCATION',
    ENTERTAINMENT = 'ENTERTAINMENT',
    FITNESS = 'FITNESS',
    FUEL = 'FUEL',
    GAMES = 'GAMES',
    GIFTS = 'GIFTS',
    GROOMING = 'GROOMING',
    GROCERIES = 'GROCERIES',
    HEALTH = 'HEALTH',
    HOBBY = 'HOBBY',
    HOUSING = 'HOUSING',
    INSURANCE = 'INSURANCE',
    LODGING = 'LODGING',
    MATERIAL_ITEMS = 'MATERIAL_ITEMS',
    OTHER = 'OTHER',
    PETS = 'PETS',
    RESTAURANTS = 'RESTAURANTS',
    TAXES = 'TAXES',
    TRANSPORTATION = 'TRANSPORTATION',
    TREATS = 'TREATS',
    UTILITIES = 'UTILITIES',
    VEHICLE = 'VEHICLE',
}

export const SpendCategoryIconMapper: Record<SpendingCategory, ReactElement> = {
    AIRFARE: <MdLocalAirport />,
    BUSINESS: <MdBusinessCenter />,
    CANNABIS: <FaCannabis />,
    CLOTHING: <FaTshirt />,
    DRINKS: <MdSportsBar />,
    EDUCATION: <MdSchool />,
    ENTERTAINMENT: <MdMovieFilter />,
    FITNESS: <MdFitnessCenter />,
    FUEL: <FaGasPump />,
    GAMES: <MdVideogameAsset />,
    GIFTS: <FaGift />,
    GROOMING: <MdContentCut />,
    GROCERIES: <MdLocalGroceryStore />,
    HEALTH: <MdHealing />,
    HOBBY: <MdBrush />,
    HOUSING: <FaHome />,
    INSURANCE: <MdShield />,
    LODGING: <MdHotel />,
    MATERIAL_ITEMS: <MdShoppingBag />,
    OTHER: <FaDollarSign />,
    PETS: <MdPets />,
    RESTAURANTS: <MdFastfood />,
    TAXES: <FaMoneyBillAlt />,
    TRANSPORTATION: <MdTrain />,
    TREATS: <FaCookieBite />,
    UTILITIES: <MdWaterDrop />,
    VEHICLE: <FaCar />,
} as const;