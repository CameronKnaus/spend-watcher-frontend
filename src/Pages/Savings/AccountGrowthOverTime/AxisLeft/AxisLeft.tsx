import * as d3 from 'd3';

interface AxisBottomProps {
    /** A D3 time scale that maps Date objects to x coordinates */
    scale: d3.ScaleLinear<number, number>;
    /** A translation to position the axis */
    transform: string;
    /** Number of ticks to display (optional) */
    tickCount?: number;
    /** A D3 time format specifier for the tick labels (optional) */
    tickFormat?: string;
}

function formatCurrency(n: number): string {
    const format = d3.format;
    // For numbers less than 1,000, we use the number directly.
    if (n < 1e3) {
        return n % 1 === 0 ? format('$,.0f')(n) : format('$,.2f')(n);
    } else if (n < 1e6) {
        // For thousands, divide by 1,000.
        const value = n / 1e3;
        const formatted = value % 1 === 0 ? format('$,.0f')(value) : format('$,.2f')(value);
        return formatted + 'K'; // or "k" if you prefer lower-case
    } else {
        // For millions
        const value = n / 1e6;
        const formatted = value % 1 === 0 ? format('$,.0f')(value) : format('$,.2f')(value);
        return formatted + 'M';
    }
}

export default function AxisLeft({ scale, transform, tickCount = 5 }: AxisBottomProps) {
    // Compute tick values using D3's scale method.
    const ticks = scale.ticks(tickCount);

    return (
        <g transform={transform}>
            {/* Render the horizontal axis line */}
            <line y1={scale.range()[0]} y2={scale.range()[1]} stroke="currentColor" />
            {/* Render tick marks and labels */}
            {ticks.map((tick, index) => {
                const y = scale(tick);
                return (
                    <g key={index} transform={`translate(-12, ${y})`}>
                        {/* Tick mark */}
                        <line x2={6} stroke="currentColor" transform="translate(6, 0)" />
                        {/* Tick label */}
                        <text
                            style={{
                                textAnchor: 'end',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                transform: 'translate(0, 3px)',
                                fill: 'currentColor',
                            }}
                        >
                            {formatCurrency(tick)}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}
