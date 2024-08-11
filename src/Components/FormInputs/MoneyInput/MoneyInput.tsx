import { ForwardedRef, forwardRef } from 'react';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';

// A wrapper for react-currency-input-field to have default values
// eslint-disable-next-line react/display-name
const MoneyInput = forwardRef((props: CurrencyInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <CurrencyInput
            ref={ref}
            allowNegativeValue={false}
            decimalsLimit={2}
            prefix="$"
            decimalScale={2}
            maxLength={12}
            autoComplete="off"
            {...props}
        />
    );
});

export default MoneyInput;
