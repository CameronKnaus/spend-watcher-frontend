import formatCurrency from 'Util/Formatters/formatCurrency/formatCurrency';
import { ReactNode } from 'react';

type CurrencyPropTypes = {
    value?: number;
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

export default function Currency({ value, isGainLoss = false, defaultValue = '', className = '' }: CurrencyPropTypes) {
    if (value === undefined) {
        return defaultValue;
    }

    return (
        <div
            className={className}
            style={{
                color: isGainLoss ? getColor(value) : 'inherit',
            }}
        >
            {formatCurrency(value, isGainLoss)}
        </div>
    );
}
