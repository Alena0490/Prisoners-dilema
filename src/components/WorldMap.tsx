import { useState, useEffect, useRef } from 'react';
import type { Country } from '../data/countries';
import Tooltip from './Tooltip';
import "./WorldMap.css";

// ============================================
// TYPES
// ============================================

type LabelInfo = { 
  x: number; 
  y: number; 
  area: number 
};

type Rect = { 
  x1: number;
  y1: number; 
  x2: number;
  y2: number 
};

type LabelItem = {
  code: string;
  label: LabelInfo;
  text: string;
  fontSize: number;
  w: number;
  h: number;
};

interface WorldMapProps {
  className?: string;
  countries: Record<string, Country>;
  showLabels: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatScore = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 0 }).format(n);

const intersects = (a: Rect, b: Rect) =>
  !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);

// ============================================
// COMPONENT
// ============================================

const WorldMap = ({ 
  className, 
  countries,
  showLabels 
}: WorldMapProps) => {
  // ============================================
  // STATE & REFS
  // ============================================
  
  const svgRef = useRef<SVGSVGElement>(null);
  const hasCalculated = useRef(false);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [labelPositions, setLabelPositions] = useState<Record<string, LabelInfo>>({});

  // ============================================
  // EFFECTS
  // ============================================
  
  // Calculate label positions when labels are shown
  useEffect(() => {
    if (!showLabels || !svgRef.current || hasCalculated.current) return;

    const positions: Record<string, LabelInfo> = {};

    Object.entries(countries).forEach(([code, country]) => {
      const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tempPath.setAttribute('d', country.path);
      svgRef.current!.appendChild(tempPath);

      const bbox = tempPath.getBBox();
      positions[code] = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
        area: bbox.width * bbox.height
      };

      svgRef.current!.removeChild(tempPath);
    });

    const rafId = requestAnimationFrame(() => {
      setLabelPositions(positions);
      hasCalculated.current = true;
    });

    return () => cancelAnimationFrame(rafId);
  }, [showLabels, countries]);

  // ============================================
  // HELPERS
  // ============================================
  
  const getCountryClass = (country: Country) => {
    if (country.hegemon === undefined) return 'country-path';
    return country.hegemon ? 'country-path hegemon' : 'country-path non-hegemon';
  };

  // Tooltip scrolling
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const handleMapWheel = (e: React.WheelEvent) => {
    const el = tooltipRef.current;
    if (!el) return;

    const canScroll = el.scrollHeight > el.clientHeight;
    if (!canScroll) return;

    // Check if we're at scroll boundaries
    const atTop = el.scrollTop === 0 && e.deltaY < 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;

    // Only prevent if we're NOT at boundaries
    if (!atTop && !atBottom) {
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    }
  };

  useEffect(() => {
    if (hoveredCountry) {
      // Tooltip je viditelný - zakázat body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Tooltip skrytý - vrátit scroll
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [hoveredCountry]);

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div 
      className={className}
      onWheel={handleMapWheel}
    >
      <svg 
        ref={svgRef}
        viewBox="0 0 1009 652"
        className="world-map-svg"
      >
        {/* Country paths */}
        <g>
          {Object.entries(countries).map(([code, country]) => (
            <path
              key={code}
              d={country.path}
              stroke="#1C3847"
              strokeWidth="0.5"
              className={getCountryClass(country)} 
              onMouseEnter={() => setHoveredCountry(code)}
              onMouseLeave={() => setHoveredCountry(null)}
              onMouseMove={(e) => {
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
            />
          ))}
        </g>

        {/* Score labels with collision detection */}
        {showLabels && (
          <g className="labels">
            {(() => {
              const placed: Rect[] = [];

              const items: LabelItem[] = Object.entries(countries)
                .map(([code, country]) => {
                  const label = labelPositions[code];
                  if (!label) return null;

                  const value = country.score ?? 0;
                  const text = label.area < 400 ? "•" : formatScore(value);

                  const fontSize = label.area > 16000 ? 11 : label.area > 6000 ? 10 : 9;
                  const w = Math.max(10, text.length * (fontSize * 0.55));
                  const h = fontSize + 4;

                  return { code, label, text, fontSize, w, h };
                })
                .filter((x): x is LabelItem => x !== null)
                .sort((a, b) => b.label.area - a.label.area);

              return items.map(({ code, label, text, fontSize, w, h }) => {
                const box: Rect = {
                  x1: label.x - w / 2,
                  y1: label.y - h / 2,
                  x2: label.x + w / 2,
                  y2: label.y + h / 2,
                };

                for (const p of placed) {
                  if (intersects(box, p)) return null;
                }
                placed.push(box);

                return (
                  <text
                    key={`label-${code}`}
                    x={label.x}
                    y={label.y}
                    className="country-label"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize }}
                  >
                    {text}
                  </text>
                );
              });
            })()}
          </g>
        )}
      </svg>
      
      {/* Tooltip on hover */}
      {hoveredCountry && (
        <Tooltip
           refEl={tooltipRef}
          hoveredCountry={hoveredCountry}
          mousePosition={mousePosition}
          countries={countries}
        />
      )}
    </div>
  );
};

export default WorldMap;