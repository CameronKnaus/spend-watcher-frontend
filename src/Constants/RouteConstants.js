const spendingBreakdown = '/spending';
export const PAGE_ROUTES = {
    dashboard: '/',
    authScreen: '/auth',
    spendingHistory: `${spendingBreakdown}/history`,
    spendingSummary: `${spendingBreakdown}/summary`,
    spendingBreakdown: `${spendingBreakdown}/:defaultTab`,
    recurringSpending: '/recurring'
};