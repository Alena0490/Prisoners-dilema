import "./Graphs.css"

interface ScoresGraphProps {
  data: number[];
  className?: string; 
}

const ScoresGraph = ({ data, className }: ScoresGraphProps) => {
    const formatScore = (n: number) =>
    new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 0 }).format(n);

    if (data.length === 0) return null;

        const binCount = 12;
        const sorted = [...data].sort((a, b) => a - b);
        const percentile95Index = Math.floor(sorted.length * 0.95);
        const maxScore = sorted[percentile95Index];
        const minScore = Math.min(...data);

        const binSize = (maxScore - minScore) / binCount;

        const width = 400;
        const height = 175;
        const padLeft = 44;
        const padRight = 16;
        const padTop = 16;
        const padBottom = 29;

        const bins = Array(binCount).fill(0);

        data.forEach(score => {
            const binIndex = Math.min(Math.floor((score - minScore) / binSize), binCount - 1);
            bins[binIndex]++;
        });

        const maxBinCount = Math.max(...bins);

        if (maxBinCount === 0) {
            return <div className='graph-placeholder'>No data to display</div>;
        }

        const barWidth = (width - padLeft - padRight) / binCount;

        // Guard clauses
        if (binSize === 0 || !isFinite(binSize)) {
            return <div className='graph-placeholder'>All scores are identical</div>;
        }

    return (
        <div className={className}>
            <svg viewBox={`0 0 ${width} ${height}`} className='hegemon-graph'>
            {/* Bars */}
            {bins.map((count, i) => {
                const barHeight = count > 0 
                ? (count / maxBinCount) * (height - padTop - padBottom)
                : 0;
                const x = padLeft + i * barWidth;
                const y = height - padBottom - barHeight;
                
                return (
                <rect
                    key={i}
                    x={x + 1}
                    y={y}
                    width={barWidth - 2}
                    height={barHeight}
                    className='bar'
                />
                );
            })}

            {/* Y axis */}
            <line
                x1={padLeft}
                y1={padTop}
                x2={padLeft}
                y2={height - padBottom}
                className='graph-axis'
                />

            {/* Y axis labels - counts */}
            {Array.from({ length: 5 }).map((_, i) => {
            const tickCount = 5;
            const value = Math.round((maxBinCount / (tickCount - 1)) * i);
            const y = height - padBottom - (value / maxBinCount) * (height - padTop - padBottom);
            
            return (
                <g key={`y-${i}`}>
                <line
                    className='axis-y'
                    x1={padLeft - 5}
                    x2={padLeft}
                    y1={y}
                    y2={y}
                />
                <text
                    x={padLeft - 8}
                    y={y}
                    textAnchor='end'
                    dominantBaseline='middle'
                    className='axis-label'
                >
                    {value}
                </text>
                </g>
            );
            })}

            {/* Y axis legend */}
            <text
            x={padLeft - 30}
            y={height / 2}
            transform={`rotate(-90, ${padLeft - 30}, ${height / 2})`}
            textAnchor='middle'
            className='axis-legend axis-legend--y'
            >
            Count
            </text>
            
            {/* X axis */}
            <line
                x1={padLeft}
                y1={height - padBottom}
                x2={width - padRight}
                y2={height - padBottom}
                className='graph-axis'
            />

            {/* X axis labels - score ranges */}
            {bins.map((_, i) => {
                if (i % 2 !== 0) return null; // Only even numbers
                const rangeStart = Math.round(minScore + i * binSize);
                const x = padLeft + i * barWidth + barWidth / 2;
            
                return (
                    <text
                        key={`x-${i}`}
                        x={x}
                        y={height - padBottom + 15}
                        textAnchor='middle'
                        className='axis-label'
                    >
                    {formatScore(rangeStart)}
                    </text>
                );
            })}

            {/* X axis legend */}
            <text
                x={width / 2}
                y={height}
                textAnchor='middle'
                className='axis-legend'
            >
                Score Range
            </text>
            </svg>
        </div>
    )
}

export default ScoresGraph
