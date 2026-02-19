import type { Country } from '../data/countries';
import { LuHandshake, LuSwords } from "react-icons/lu";
import "./Tooltip.css"

interface TooltipProps  {
    hoveredCountry: string; 
    mousePosition: { x: number, y: number }; 
    countries: Record<string, Country> 
}

const Tooltip = ({hoveredCountry, mousePosition, countries}: TooltipProps) => {
  // Screen edge detection
  const tooltipX = mousePosition.x + 10;
  const tooltipY = mousePosition.y + 10;
  
  const shouldFlipVertical = mousePosition.y > window.innerHeight / 2;
  const shouldFlipHorizontal = mousePosition.x > window.innerWidth / 2;
  
  const style = {
    left: shouldFlipHorizontal ? mousePosition.x - 210 : tooltipX,
    top: shouldFlipVertical ? 'auto' : tooltipY,
    bottom: shouldFlipVertical ? window.innerHeight - mousePosition.y + 10 : 'auto'
  };
  
  return (
      <div 
            className="tooltip"
            style={style}
        >
            <strong>{countries[hoveredCountry]?.name}</strong>
            <div>Score: {countries[hoveredCountry]?.score?.toFixed(0) || 'N/A'}</div>
            <div
                className={countries[hoveredCountry]?.hegemon ? "hegemon": "not-hegemon"}
            >
                Hegemon: {countries[hoveredCountry]?.hegemon ? 'Yes' : 'No'}</div>
            <div>Ranking: {countries[hoveredCountry]?.ranking || 'N/A'}</div>
            {countries[hoveredCountry]?.playTable && Object.keys(countries[hoveredCountry].playTable).length > 0 && (
                <>
                    <div className="strategies-header">Strategies:</div>
                    {Object.entries(countries[hoveredCountry].playTable).map(([neighborCode, action]) => (
                    <div key={neighborCode} className="strategy-item">
                        - {countries[neighborCode]?.name}: 
                        <span className={action === 'cooperate' ? 'cooperate' : 'defect'}>
                            {action === 'cooperate' ? (
                                <>
                                <LuHandshake /> cooperate
                                </>
                            ) : (
                                <>
                                <LuSwords /> betray
                                </>
                            )}
                        </span>
                    </div>
                    ))}
                </>
            )}
        </div>
  )
}

export default Tooltip
