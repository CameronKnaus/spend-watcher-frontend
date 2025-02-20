import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import useTransactions from 'Hooks/useTransactions/useTransactions';
import BarChart from './BarChart';

export default function BarChartModule() {
    const { isLoading, data } = useTransactions();

    return (
        <ModuleContainer isLoading={isLoading} heading="Bar chart" elevation="low">
            {data && <BarChart transactions={data.transactions} />}
        </ModuleContainer>
    );
}
