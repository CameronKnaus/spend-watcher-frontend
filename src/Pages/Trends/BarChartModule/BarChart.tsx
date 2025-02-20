import { Transaction } from 'Types/Services/spending.model';

type BarChartPropTypes = {
    transactions: Transaction[];
};

export default function BarChart({ transactions }: BarChartPropTypes) {
    return <div />;
}
