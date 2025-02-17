import Currency from 'Components/Currency/Currency';
import * as d3 from 'd3';
import { format } from 'date-fns';
import useContent from 'Hooks/useContent';
import { useState } from 'react';
import { UseMeasureRect } from 'react-use/lib/useMeasure';
import { DbDate } from 'Types/dateTypes';
import { AccountGrowthOverTimeV1Response } from 'Types/Services/accounts.model';
import { useIsMobile } from 'Util/IsMobileContext';
import styles from './AccountGrowthOverTime.module.css';
import AxisBottom from './AxisBottom/AxisBottom';
import AxisLeft from './AxisLeft/AxisLeft';

export type ChartDimensions = {
    width: number;
    height: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    boundedWidth: number;
    boundedHeight: number;
};

type AccountGrowthOverTimePropTypes = {
    dataset: AccountGrowthOverTimeV1Response;
    containerMeasurement: UseMeasureRect;
};

export default function AccountGrowthOverTime({ dataset, containerMeasurement }: AccountGrowthOverTimePropTypes) {
    const totalsByDate = d3.rollup(
        dataset,
        (v) => d3.sum(v, (d) => d.amount),
        (d) => d.date,
    );
    const totalsArray: DataPoint[] = Array.from(totalsByDate, ([date, amount]) => ({ date, amount }) as DataPoint);

    // Hooks
    const [hoveredData, setHoveredData] = useState<DataPoint>(totalsArray[totalsArray.length - 1]);
    const getContent = useContent('savings');
    const isMobile = useIsMobile();

    type DataPoint = {
        date: DbDate;
        amount: number;
    };

    const maxNumber = d3.max(totalsArray, (d) => d.amount) ?? 0;
    const canvasDimensions: ChartDimensions = {
        width: containerMeasurement.width,
        height: 400,
        margin: {
            top: 12,
            right: 24,
            bottom: 24,
            left: maxNumber > 100_000 ? 64 : 56, // making space for larger Y-axis labels
        },
        boundedWidth: 0,
        boundedHeight: 0,
    };

    // Set true bounded width and height
    canvasDimensions.boundedWidth =
        canvasDimensions.width - canvasDimensions.margin.left - canvasDimensions.margin.right;
    canvasDimensions.boundedHeight =
        canvasDimensions.height - canvasDimensions.margin.top - canvasDimensions.margin.bottom;

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
    const xScalePadding = 4;
    const xScale = d3
        .scaleTime()
        .domain(d3.extent(totalsArray, xAccessor) as [Date, Date])
        .range([xScalePadding, canvasDimensions.boundedWidth + xScalePadding])
        .nice();

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

    // Bisector for the X accessor
    const bisectDate = d3.bisector(xAccessor).left;

    // For mouse move
    function handlePointerMove(event: React.PointerEvent<SVGRectElement>) {
        // mouse / touch position relative to chart bounds
        const [xPos] = d3.pointer(event);
        const hoveredDate = xScale.invert(xPos);

        // Finding the closest data point to the hovered date
        const index = bisectDate(totalsArray, hoveredDate);
        const d0 = totalsArray[index - 1];
        const d1 = totalsArray[index];

        let closestDataPoint: DataPoint | undefined;
        if (d0 && d1) {
            closestDataPoint =
                hoveredDate.getTime() - xAccessor(d0).getTime() < xAccessor(d1).getTime() - hoveredDate.getTime()
                    ? d0
                    : d1;
        } else {
            closestDataPoint = d0 || d1;
        }

        setHoveredData(closestDataPoint ?? totalsArray[totalsArray.length - 1]);
    }

    return (
        <>
            <div className={styles.overviewContainer}>
                <h3 className={styles.header}>{getContent('netWorth')}</h3>
                <div className={styles.dataContainer}>
                    <Currency className={styles.amount} amount={hoveredData?.amount ?? 0} />
                    <span className={styles.date}>
                        {hoveredData ? format(new Date(hoveredData.date), 'MMMM yyyy') : '--'}
                    </span>
                </div>
            </div>
            <svg width={canvasDimensions.width} height={canvasDimensions.height}>
                <AxisLeft
                    scale={yScale}
                    transform={`translate(0, ${canvasDimensions.margin.top})`}
                    dimensions={canvasDimensions}
                />
                <AxisBottom
                    scale={xScale}
                    transform={`translate(${canvasDimensions.margin.left}, ${canvasDimensions.height - canvasDimensions.margin.bottom})`}
                    tickCount={isMobile ? 4 : 6}
                />
                <g
                    id="chart-bounds"
                    transform={`translate(${canvasDimensions.margin.left}, ${canvasDimensions.margin.top})`}
                >
                    {/* Hitbox for scrubbing */}
                    <rect
                        width={canvasDimensions.boundedWidth}
                        height={canvasDimensions.boundedHeight}
                        fill="transparent"
                        style={{ pointerEvents: 'all', touchAction: 'none' }}
                        onPointerMove={handlePointerMove}
                    />
                    <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle
                        cx={xScale(xAccessor(hoveredData))}
                        cy={yScale(yAccessor(hoveredData))}
                        r={6}
                        fill="currentColor"
                        className={styles.hoverPoint}
                    >
                        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                </g>
            </svg>
        </>
    );
}
