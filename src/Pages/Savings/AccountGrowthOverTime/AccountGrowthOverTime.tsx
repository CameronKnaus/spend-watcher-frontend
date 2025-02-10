import ModuleContainer from 'Components/ModuleContainer/ModuleContainer';
import SkeletonLoader from 'Components/Shared/SkeletonLoader';
import * as d3 from 'd3';
import useAccountGrowthOverTimeService from 'Hooks/useAccountGrowthOverTimeService/useAccountGrowthOverTimeService';
import useContent from 'Hooks/useContent';
import { useMeasure } from 'react-use';
import { DbDate } from 'Types/dateTypes';
import AxisBottom from './AxisBottom/AxisBottom';
import AxisLeft from './AxisLeft/AxisLeft';

export default function AccountGrowthOverTime() {
    const getContent = useContent('savings');
    const { isLoading, data: dataset } = useAccountGrowthOverTimeService();
    const [tileRef, tileMeasurement] = useMeasure<HTMLDivElement>();

    const tileTitle = getContent('savingsOverTime');
    if (isLoading || !dataset) {
        return (
            <ModuleContainer heading={tileTitle}>
                <SkeletonLoader />
                <SkeletonLoader style={{ width: '70%' }} />
                <SkeletonLoader style={{ width: '35%' }} />
            </ModuleContainer>
        );
    }

    const canvasDimensions = {
        width: tileMeasurement.width,
        height: 400,
        margin: {
            top: 10,
            right: 10,
            bottom: 30,
            left: 60,
        },
        boundedWidth: 0,
        boundedHeight: 0,
    };

    // Set true bounded width and height
    canvasDimensions.boundedWidth =
        canvasDimensions.width - canvasDimensions.margin.left - canvasDimensions.margin.right;
    canvasDimensions.boundedHeight =
        canvasDimensions.height - canvasDimensions.margin.top - canvasDimensions.margin.bottom;

    const totalsByDate = d3.rollup(
        dataset,
        (v) => d3.sum(v, (d) => d.amount),
        (d) => d.date,
    );

    type DataPoint = {
        date: DbDate;
        amount: number;
    };
    const totalsArray: DataPoint[] = Array.from(totalsByDate, ([date, amount]) => ({ date, amount }) as DataPoint);

    const dateParser = d3.timeParse('%Y-%m-%d');
    const xAccessor = (d: DataPoint) => {
        const parsedDate = dateParser(d.date);
        if (parsedDate === null) {
            throw new Error(`Invalid date: ${d.date}`);
        }
        return parsedDate;
    };
    const yAccessor = (d: DataPoint) => d.amount;

    // SCALES
    const xScale = d3
        .scaleTime()
        .domain(d3.extent(totalsArray, xAccessor) as [Date, Date])
        .range([0, canvasDimensions.boundedWidth]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(totalsArray, yAccessor) as [number, number])
        .range([canvasDimensions.boundedHeight, 0])
        .nice();

    // LINE GENERATOR
    const lineGenerator = d3
        .line<DataPoint>()
        .x((d) => xScale(xAccessor(d)) as number)
        .y((d) => yScale(yAccessor(d)) as number);

    const linePath = lineGenerator(totalsArray)!;

    return (
        <ModuleContainer forwardRef={tileRef} heading={tileTitle}>
            <svg width={canvasDimensions.width} height={canvasDimensions.height}>
                <g
                    id="chart-bounds"
                    transform={`translate(${canvasDimensions.margin.left}, ${canvasDimensions.margin.top})`}
                >
                    <path d={linePath} fill="none" stroke="black" strokeWidth="2" />
                </g>
                <AxisLeft
                    scale={yScale}
                    transform={`translate(${canvasDimensions.margin.left}, ${canvasDimensions.margin.top})`}
                />
                <AxisBottom
                    scale={xScale}
                    transform={`translate(${canvasDimensions.margin.left}, ${canvasDimensions.height - canvasDimensions.margin.bottom})`}
                />
            </svg>
        </ModuleContainer>
    );
}
