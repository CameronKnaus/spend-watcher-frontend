import CurrencyInput from 'react-currency-input-field';

// When tracking this field, the containing parent component should have a state like const [value, setValue] = React.useState();
// Then you can pass the setValue to the stateUpdater prop to ensure the parent component remains up to date
export default function MoneyInput({ id = 'currency-input', name, placeholder, value, stateUpdater = () => { /* NOOP*/ }, className }) {

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
                       onValueChange={value => stateUpdater(value)}
        />
    );
}