import { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import "./WorldMap.css";

interface WorldMapProps {
  className?: string;
}

const WorldMap = ({ className }: WorldMapProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountryFill = (code: string) => {
    if (hoveredCountry === code) return '#F1B3F2';
    return '#8EBFBF';
  };

  return (
    <div className={className}>
      <svg 
        viewBox="0 0 1009 652"
        className="world-map-svg"
      >
        <g>
          {Object.entries(COUNTRIES).map(([code, country]) => (
            <path
              key={code}
              d={country.path}
              fill={getCountryFill(code)}
              stroke="#1C3847"
              strokeWidth="0.5"
              className="country-path"
              onMouseEnter={() => setHoveredCountry(code)}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default WorldMap;