import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import useTransactions from 'Hooks/useTransactions/useTransactions';
import { useMeasure } from 'react-use';
import BarChart from './BarChart';

export default function BarChartModule() {
    const [containerRef, containerMeasurement] = useMeasure();
    const { isLoading, data } = useTransactions();

    return (
        <ModuleContainer forwardRef={containerRef} isLoading={isLoading} heading="Bar chart" elevation="low">
            {data && <BarChart transactionResponse={data} containerMeasurement={containerMeasurement} />}
        </ModuleContainer>
    );
}
