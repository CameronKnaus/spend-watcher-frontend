import { ComponentProps } from 'react';
import { Control, Controller, FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

type NumericFormatWithoutEssentialAttributes = Omit<ComponentProps<typeof NumericFormat>, 'onChange' | 'value'>;

type MoneyInputPropTypes<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    hookFormSetValue: UseFormSetValue<T>;
    isRequired?: boolean;
} & NumericFormatWithoutEssentialAttributes;

export default function MoneyInput<T extends FieldValues>({
    control,
    name,
    hookFormSetValue,
    isRequired = false,
    ...props
}: MoneyInputPropTypes<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: isRequired }}
            render={({ field: { ref, ...rest } }) => (
                <NumericFormat
                    thousandSeparator=","
                    decimalSeparator="."
                    prefix="$"
                    decimalScale={2}
                    getInputRef={ref}
                    onValueChange={({ floatValue }) => {
                        // @ts-expect-error I should figure out the proper typing of this but it works for now
                        hookFormSetValue(name, floatValue);
                    }}
                    {...props}
                    {...rest}
                />
            )}
        />
    );
}
