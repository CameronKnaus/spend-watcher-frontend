// This will need to be moved if other currencies are supported in the future
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export default function formatCurrency(amount: number | string) {
    const amountToFormat = typeof amount === 'string' ? Number(amount) : amount;

    return currencyFormatter.format(amountToFormat);
}