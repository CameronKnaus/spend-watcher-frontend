const locale = {
    dashboard: {
        monthOverview: '{{0}} overview',
        totalSpent: 'Total spent',
        discretionaryTotal: 'Discretionary total',
        recurringTotal: 'Recurring total',
        spendRatio: 'Discretionary ratio',
        topCategories: 'Top discretionary categories',
    },
    spendingData: {
        topFour: 'Top four cat. total',
        other: 'Rest of spending',
        moreLabel: 'See more',
    },
    general: {
        empty: '--',
    },
    transactions: {
        recent: 'Recent transactions',
        todayLabel: '{{0}} - Today',
        yesterdayLabel: '{{0}} - Yesterday',
        emptyPlaceholder: '--',
        clearSelection: 'Clear selection',
        logExpense: 'Log expense',
        newExpense: 'New expense',
        amountLabel: 'Amount',
        categoryLabel: 'Category',
        notesLabel: 'Notes',
        dateLabel: 'Date of Expense',
        tripLabel: 'Linked Trip',
        notesPlaceholder: 'About your expense',
        amountPlaceholder: '$0.00',
    },
    ACCOUNT_CATEGORIES: {
        CHECKING: 'Checking',
        SAVINGS: 'Savings',
        INVESTING: 'Investment',
        BONDS: 'Bonds',
    },
    SPENDING_CATEGORIES: {
        RESTAURANTS: 'Dining Out',
        DRINKS: 'Drinks',
        GROCERIES: 'Groceries',
        ENTERTAINMENT: 'Entertainment',
        TRANSPORTATION: 'Transportation',
        VEHICLE: 'Vehicle',
        FUEL: 'Fuel',
        FITNESS: 'Fitness',
        GROOMING: 'Grooming & Self-Care',
        BUSINESS: 'Business Expense',
        MATERIAL_ITEMS: 'Material Items',
        AIRFARE: 'Airfare',
        LODGING: 'Lodging',
        HEALTH: 'Healthcare',
        CLOTHING: 'Clothing',
        GIFTS: 'Gifts & Charity',
        EDUCATION: 'Education',
        UTILITIES: 'Utilities',
        HOUSING: 'Housing',
        CANNABIS: 'Cannabis',
        PETS: 'Pets',
        INSURANCE: 'Insurance',
        GAMES: 'Games',
        HOBBY: 'Hobbies',
        TREATS: 'Treats',
        TAXES: 'Taxes',
        OTHER: 'Other',
    },
} as const;

export default locale;
