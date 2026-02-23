import './Graphs.css'

// ============================================
// TYPES
// ============================================

interface PayoffsGraphProps {
  data: {hegemonAvg: number, otherAvg: number}[];
  className?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatScore = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 0 }).format(n);

// ============================================
// COMPONENT
// ============================================

const PayoffsGraph = ({ data, className }: PayoffsGraphProps) => {
  // ============================================
  // VALIDATION
  // ============================================
  
  if (data.length === 0) return null;

  const allValues = data
    .flatMap(d => [d.hegemonAvg, d.otherAvg])
    .filter(v => isFinite(v));

  if (allValues.length === 0) return null;

  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  if (maxValue === minValue) return null;

  if (data.length < 2) {
    return <div className='graph-placeholder'>Need at least 2 points</div>;
  }

  // ============================================
  // GRAPH DIMENSIONS
  // ============================================
  
  const width = 400;
  const height = 175;
  const padLeft = 55;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 29;

  // ============================================
  // SCALE FUNCTIONS
  // ============================================
  
  const scaleX = (index: number) =>
    padLeft + (index / (data.length - 1)) * (width - padLeft - padRight);

  const scaleY = (value: number) =>
    height - padBottom - ((value - minValue) / (maxValue - minValue)) * (height - padTop - padBottom);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  // Hegemon line path
  const hegemonPath = data
    .map((d, index) => {
      const x = scaleX(index);
      const y = scaleY(d.hegemonAvg);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Other countries line path
  const otherPath = data
    .map((d, index) => {
      const x = scaleX(index);
      const y = scaleY(d.otherAvg);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Y-axis ticks
  const yTicks = Array.from(
    new Set([minValue, Math.round((minValue + maxValue) / 2), maxValue])
  ).sort((a, b) => a - b);
  
  // X-axis ticks
  const xTickCount = Math.min(5, data.length);
  const xTickStep = Math.floor(data.length / xTickCount);

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className={className}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className='payoffs-graph'
        role='img'
        aria-label={`Line graph comparing average scores: hegemons ranging from ${formatScore(Math.min(...data.map(d => d.hegemonAvg)))} to ${formatScore(Math.max(...data.map(d => d.hegemonAvg)))}, others from ${formatScore(Math.min(...data.map(d => d.otherAvg)))} to ${formatScore(Math.max(...data.map(d => d.otherAvg)))} over ${data.length} steps`}
      >
        <title>Average Payoffs Comparison: Hegemons vs Others</title>
        <desc>Two lines showing average scores over time. Green line represents hegemons, red line represents other countries.</desc>
        {/* Hegemon line */}
        <path 
          d={hegemonPath} 
          className='graph-line graph-line--hegemon'
        />

        {/* Other countries line */}
        <path 
          d={otherPath} 
          className='graph-line graph-line--other'
        />
        
        {/* X axis */}
        <line
          x1={padLeft}
          y1={height - padBottom}
          x2={width - padRight}
          y2={height - padBottom}
          className='graph-axis'
          aria-hidden='true'
        />
        
        {/* X axis labels */}
        <g aria-hidden='true'>
          {Array.from({ length: xTickCount }).map((_, i) => {
            const index = i * xTickStep;
            if (index >= data.length) return null;
            
            const x = scaleX(index);
            return (
              <g key={`x-${index}`}>
                <line
                  className='axis-x'
                  x1={x}
                  x2={x}
                  y1={height - padBottom}
                  y2={height - padBottom + 5}
                />
                <text
                  x={x}
                  y={height - padBottom + 10}
                  textAnchor='middle'
                  className='axis-label'
                >
                  {index}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* X axis legend */}
        <text
          x={width / 2}
          y={height}
          textAnchor='middle'
          className='axis-legend'
          aria-hidden='true'
        >
          Ticks
        </text>

        {/* Y axis */}
        <line
          x1={padLeft}
          y1={padTop}
          x2={padLeft}
          y2={height - padBottom}
          className='graph-axis'
          aria-hidden='true'
        />
        
        {/* Y axis labels */}
        <g aria-hidden='true'>
          {yTicks.map(value => {
            const y = scaleY(value);
            return (
              <g key={`y-${value}`}>
                <line
                  className='axis-y'
                  x1={padLeft}
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
                  {formatScore(value)}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* Y axis legend */}
        <text
          x={padLeft - 30}
          y={height / 2 - 10}
          transform={`rotate(-90, ${padLeft - 30}, ${height / 2})`}
          textAnchor='middle'
          dominantBaseline='middle'
          className='axis-legend axis-legend--y'
          aria-hidden='true'
        >
          Average Score
        </text>
        
        {/* Legend */}
        <g 
          role='list' 
          aria-label='Graph legend' 
          className='legend'
        >
          <text x={width - 100} y={20} className='legend-text'>
            <tspan fill='var(--success-color)'>■</tspan> Hegemons
          </text>
          <text x={width - 100} y={35} className='legend-text'>
            <tspan fill='var(--error-color)'>■</tspan> Others
          </text>
        </g>
      </svg>
    </div>
  );
}

export default PayoffsGraph