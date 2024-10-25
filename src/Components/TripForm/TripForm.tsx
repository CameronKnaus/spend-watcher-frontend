import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import DatePicker from 'Components/FormInputs/DatePickerController/DatePickerController';
import SERVICE_ROUTES from 'Constants/ServiceRoutes';
import { format, parse } from 'date-fns';
import useContent from 'Hooks/useContent';
import { useForm } from 'react-hook-form';
import { dbDateFormat } from 'Types/dateTypes';
import { AddTripRequestParams, v1AddTripSchema } from 'Types/Services/trips.model';
import styles from './TripForm.module.css';

type TripFormPropTypes = {
    onSubmit: () => void;
    onCancel: () => void;
};

const addTripQueryKey = 'add-trip';

export default function TripForm({ onSubmit, onCancel }: TripFormPropTypes) {
    const queryClient = useQueryClient();
    const getContent = useContent('trips');
    const getGeneralContent = useContent('general');

    const tripService = useMutation({
        mutationKey: [addTripQueryKey],
        mutationFn: (params: AddTripRequestParams) => axios.post(SERVICE_ROUTES.postAddTrip, params),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['trips'],
            });

            form.reset();
        },
    });

    const defaultStartDate = format(new Date(), dbDateFormat);
    const form = useForm<AddTripRequestParams>({
        resolver: zodResolver(v1AddTripSchema),
        mode: 'onChange', // Least performant but not a concern here
        defaultValues: {
            tripName: '',
            startDate: defaultStartDate,
            endDate: defaultStartDate,
        },
    });

    function handleCancel() {
        form.reset();
        onCancel();
    }

    async function handleSubmission(submission: AddTripRequestParams) {
        await tripService.mutate(submission);
        onSubmit();
    }

    const startDate = parse(form.watch('startDate'), dbDateFormat, new Date());
    const endDate = parse(form.watch('endDate'), dbDateFormat, new Date());

    return (
        <>
            <form className={styles.tripForm} onSubmit={form.handleSubmit(handleSubmission)}>
                <label>{getContent('tripName')}</label>
                <input
                    className={styles.textInput}
                    placeholder={getContent('tripNamePlaceholder')}
                    autoComplete="off"
                    {...form.register('tripName', { minLength: 1, maxLength: 100, required: true })}
                />
                <label className={styles.dateLabel}>{getContent('startDate')}</label>
                <DatePicker
                    isRequired
                    control={form.control}
                    name="startDate"
                    views={['year', 'month', 'day']}
                    format="MMMM do, yyyy"
                    maxDate={endDate}
                    className={styles.textInput}
                />
                <label className={styles.dateLabel}>{getContent('endDate')}</label>
                <DatePicker
                    isRequired
                    control={form.control}
                    name="endDate"
                    views={['year', 'month', 'day']}
                    format="MMMM do, yyyy"
                    minDate={startDate}
                    className={styles.textInput}
                />
            </form>
            <BottomSheet>
                <CustomButton variant="secondary" onClick={handleCancel} layout="full-width">
                    {getGeneralContent('cancel')}
                </CustomButton>
                <CustomButton
                    isDisabled={!form.formState.isValid}
                    variant="primary"
                    onClick={form.handleSubmit(handleSubmission)}
                    layout="full-width"
                >
                    {getGeneralContent('submit')}
                </CustomButton>
            </BottomSheet>
        </>
    );
}
