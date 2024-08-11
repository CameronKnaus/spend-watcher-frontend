import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type DatePickerWithoutEssentialAttributes = Omit<DatePickerProps<Date>, 'onChange' | 'onAccept' | 'value'>;

type DatePickerControllerPropTypes<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
} & DatePickerWithoutEssentialAttributes;

// This is a wrapper to use MUI-DatePicker with react-hook-form. All props from DatePicker are passed through except onChange, onAccept, and value
export default function DatePickerController<T extends FieldValues>({
    control,
    name,
    ...datePickerProps
}: DatePickerControllerPropTypes<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <DatePicker
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onAccept={field.onChange}
                    {...datePickerProps}
                />
            )}
        />
    );
}
