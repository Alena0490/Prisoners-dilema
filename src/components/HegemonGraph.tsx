import "./Graphs.css"

interface HegemonGraphProps {
  data: number[];
  className?: string; 
}

const HegemonGraph = ({ data, className }: HegemonGraphProps) => {
    if (data.length === 0) {
        return null;
    }

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    if (data.length < 2) {
    return <div className='graph-placeholder'>Need at least 2 points</div>;
    }

    if (maxValue === minValue || !isFinite(maxValue) || !isFinite(minValue)) {
    return <div className='graph-placeholder'>Invalid data</div>;
    }

  const width = 400;
  const height = 175;
  const padLeft = 44;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 29;

  const scaleX = (index: number) =>
    padLeft + (index / (data.length - 1)) * (width - padLeft - padRight);

  const scaleY = (value: number) =>
    height - padBottom - ((value - minValue) / (maxValue - minValue)) * (height - padTop - padBottom);

  const pathData = data
    .map((value, index) => {
      const x = scaleX(index);
      const y = scaleY(value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const yTicks = Array.from(
    new Set([minValue, Math.round((minValue + maxValue) / 2), maxValue])
  ).sort((a, b) => a - b);
  
  const xTickCount = Math.min(5, data.length);
  const xTickStep = Math.floor(data.length / xTickCount);

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${width} ${height}`} className='hegemon-graph'>
        <path d={pathData} className='graph-line' />
        
        {/* X axis */}
        <line
          x1={padLeft}
          y1={height - padBottom}
          x2={width - padRight}
          y2={height - padBottom}
          className='graph-axis'
        />
        
        {/* X axis labels */}
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
                className="axis-label"
              >
                {index}
              </text>
            </g>
          );
        })}
        
        {/* X axis legend */}
        <text
          x={width / 2}
          y={height}
          textAnchor='middle'
          className='axis-legend'
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
        />
        
        {/* Y axis labels */}
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
          dominantBaseline='middle'
          className='axis-legend axis-legend--y'
        >
          Hegemons
        </text>
      </svg>
    </div>
  );
};

export default HegemonGraph;