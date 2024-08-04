import { Dispatch, SetStateAction } from 'react';
import CurrencyInput from 'react-currency-input-field';

// Have the consumer manage the state of this component.  It is a controlled-only component.

type MoneyInputPropTypes = {
    id?: string,
    name: string,
    placeholder: string,
    value?: string,
    stateUpdater: Dispatch<SetStateAction<string | undefined>>,
    className: string
}
export default function MoneyInput({ id = 'currency-input', name, placeholder, value, stateUpdater, className }: MoneyInputPropTypes) {

    return (
        <CurrencyInput allowNegativeValue={false}
                       id={id}
                       name={name}
                       placeholder={placeholder}
                       decimalsLimit={2}
                       prefix='$'
                       className={className}
                       decimalScale={2}
                       maxLength={12}
                       autoComplete='off'
                       value={value}
                       onValueChange={value => stateUpdater(value ?? '')}
        />
    );
}