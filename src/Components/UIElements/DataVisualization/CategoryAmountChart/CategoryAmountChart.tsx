import { ResponsivePie } from '@nivo/pie';
import { SPENDING_CATEGORIES, SpendingCategoryType } from 'Constants/categories_deprecated';
import useContent from 'CustomHooks/useContent';
import styles from './CategoryAmountChart.module.css';
import { useIsMobile } from 'Util/IsMobileContext';
import { Color } from 'Types/StyleTypes';

type ChartDataPoint = {
    id: string;
    label: string;
    value: number;
    color: Color;
};

type CategoryAmountChartPropTypes = {
    amountList: Array<{
        category: SpendingCategoryType;
        amount: number;
    }>;
    useDollarValues?: boolean;
};

// Expects an array of the structure {category: 'RESTAURANT', amount: 123}
export default function CategoryAmountChart({ amountList, useDollarValues = false }: CategoryAmountChartPropTypes) {
    const isMobile = useIsMobile();
    const getSpendingLabel = useContent('SPENDING_CATEGORIES');

    if (!amountList) {
        return null;
    }

    const generatedTheme: Array<Color> = [];
    const dataForChart: Array<ChartDataPoint> = [];
    amountList.forEach((element) => {
        const category = element.category;
        const color: Color = SPENDING_CATEGORIES[category]?.color ?? '#333333';
        const label = getSpendingLabel(category);

        generatedTheme.push(color);
        dataForChart.push({
            id: label,
            label,
            value: element.amount,
            color,
        });
    });

    function formatValue(value: number) {
        return useDollarValues ? `$${value.toFixed(2)}` : `x${value}`;
    }

    const margin = isMobile
        ? { top: 20, right: 10, bottom: 20, left: 10 }
        : { top: 20, right: 140, bottom: 20, left: 140 };

    return (
        <div className={styles.container}>
            <ResponsivePie
                isInteractive
                data={dataForChart}
                margin={margin}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                enableArcLinkLabels={!isMobile}
                borderColor="var(--theme-light-border)"
                arcLabelsRadiusOffset={0.6}
                arcLinkLabel={(slice) => `${slice.label} - ${formatValue(slice.value)}`}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsStraightLength={0}
                arcLinkLabelsDiagonalLength={16}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={20}
                arcLabelsTextColor="#FFFFFF"
                colors={generatedTheme}
                valueFormat={formatValue}
                startAngle={0}
                endAngle={360}
            />
        </div>
    );
}
