import formatCurrency from 'Util/Formatters/formatCurrency/formatCurrency';
import { ReactNode } from 'react';

type CurrencyPropTypes = {
    amount?: number;
    isGainLoss?: boolean;
    defaultValue?: ReactNode;
    className?: string;
};

function getColor(value: number) {
    if (value > 0) {
        return 'var(--token-color-semantic-gain)';
    }

    if (value < 0) {
        return 'var(--token-color-semantic-loss)';
    }

    return 'var(--token-color-text-standard)';
}

export default function Currency({ amount, isGainLoss = false, defaultValue = '', className = '' }: CurrencyPropTypes) {
    if (amount === undefined) {
        return defaultValue;
    }

    return (
        <span
            className={className}
            style={{
                color: isGainLoss ? getColor(amount) : 'inherit',
            }}
        >
            {formatCurrency(amount, isGainLoss)}
        </span>
    );
}
