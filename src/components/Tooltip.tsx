import type { Country } from '../data/countries';
import { LuHandshake, LuSwords } from 'react-icons/lu';
import './Tooltip.css'

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
    <div 
        className={`tooltip ${isMobile ? 'tooltip--mobile' : ''}`}  
        style={style}
        role='tooltip'
        aria-label={`Information about ${country.name}`} 
    >
        <div className='tooltip-scroll' ref={refEl}>
        {/* Country Name */}
        <strong>{country.name}</strong>
        
        {/* Basic Info */}
        <dl> 
        <div>
          <dt className='sr-only'>Score</dt> 
          <dd>Score: {country.score?.toFixed(0) || 'N/A'}</dd>
        </div>
        
        <div className={country.hegemon ? 'hegemon' : 'not-hegemon'}>
          <dt className='sr-only'>Hegemon status</dt>
          <dd>Hegemon: {country.hegemon ? 'Yes' : 'No'}</dd>
        </div>
        
        <div>
          <dt className='sr-only'>Ranking</dt>
          <dd>Ranking: {country.ranking || 'N/A'}</dd>
        </div>
      </dl>
        
        {/* Strategies with Neighbors */}
        {country.playTable && Object.keys(country.playTable).length > 0 && (
            <section aria-label='Strategies with neighbors'>
            <h3 className='strategies-header'>Strategies:</h3>
            <ul role='list'>
                {Object.entries(country.playTable).map(([neighborCode, action]) => (
                <li key={neighborCode} className='strategy-item'>
                    {countries[neighborCode]?.name}: 
                    <span 
                    className={action === 'cooperate' ? 'cooperate' : 'defect'}
                    aria-label={action === 'cooperate' ? 'Cooperating' : 'Betraying'}
                    >
                    {action === 'cooperate' ? (
                        <>
                        <LuHandshake aria-hidden='true' /> cooperate
                        </>
                    ) : (
                        <>
                        <LuSwords aria-hidden='true' /> betray
                        </>
                    )}
                    </span>
                </li>
                ))}
            </ul>
            </section>
        )}
        </div>
    </div>
  );
};

export default Tooltip;