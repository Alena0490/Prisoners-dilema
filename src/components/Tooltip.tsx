import type { Country } from '../data/countries';
import { LuHandshake, LuSwords } from "react-icons/lu";
import "./Tooltip.css"

// ============================================
// TYPES
// ============================================

interface TooltipProps {
    hoveredCountry: string;
    mousePosition: { x: number, y: number };
    isMobile?: boolean;
    countries: Record<string, Country>;
    refEl: React.RefObject<HTMLDivElement | null>;
}

// ============================================
// COMPONENT
// ============================================

const Tooltip = ({
    hoveredCountry,
    mousePosition,
    countries,
    refEl,
    isMobile
}: TooltipProps) => {
  // ============================================
  // POSITIONING LOGIC
  // ============================================
  
  // Detect screen edges to flip tooltip direction
  const shouldFlipVertical = mousePosition.y > window.innerHeight / 2;
  const shouldFlipHorizontal = mousePosition.x > window.innerWidth / 2;
  
  const style = isMobile 
  ? {
      // Mobile - centered
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90vw'
    }
  : {
      // Desktop - follow mouse
      left: shouldFlipHorizontal ? mousePosition.x - 210 : mousePosition.x + 10,
      top: shouldFlipVertical ? 'auto' : mousePosition.y + 10,
      bottom: shouldFlipVertical ? window.innerHeight - mousePosition.y + 10 : 'auto'
    };

  // ============================================
  // DATA
  // ============================================
  
  const country = countries[hoveredCountry];
  if (!country) return null;

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className={`tooltip ${isMobile ? 'tooltip--mobile' : ''}`}  style={style}>
        <div className="tooltip-scroll" ref={refEl}>
        {/* Country Name */}
        <strong>{country.name}</strong>
        
        {/* Basic Info */}
        <div>Score: {country.score?.toFixed(0) || 'N/A'}</div>
        <div className={country.hegemon ? "hegemon" : "not-hegemon"}>
            Hegemon: {country.hegemon ? 'Yes' : 'No'}
        </div>
        <div>Ranking: {country.ranking || 'N/A'}</div>
        
        {/* Strategies with Neighbors */}
        {country.playTable && Object.keys(country.playTable).length > 0 && (
            <>
            <div className="strategies-header">Strategies:</div>
            {Object.entries(country.playTable).map(([neighborCode, action]) => (
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
    </div>
  );
};

export default Tooltip;