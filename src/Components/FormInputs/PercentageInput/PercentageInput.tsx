import type { FieldValues } from 'react-hook-form';
import NumericInput from '../NumericInput/NumericInput';
import type { NumericInputPropTypes } from '../NumericInput/NumericInput';

export default function PercentageInput<T extends FieldValues>(props: NumericInputPropTypes<T>) {
    return <NumericInput {...props} suffix="%" />;
}
