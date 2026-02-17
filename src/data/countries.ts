import { MAP_PATHS } from './worldMapPaths';
import { COUNTRY_NAMES } from './countryNames';
import { NEIGHBORS } from './neighbors';

export interface Country {
    code: string;
    name: string;
    path: string;
    neighbors: string[];
    strategy?: 'C' | 'D';
    score?: number;
    totalScore?: number;
    gdp?: number; 
    hegemon?: boolean;
    playTable?: Record<string, 'cooperate' | 'defect'>
    ranking?: number
    nextStrongest?: string
    nextWeakest?: string
}

// Automatically generate the COUNTRIES object based on MAP_PATHS, COUNTRY_NAMES, and NEIGHBORS data    
export const COUNTRIES: Record<string, Country> = Object.fromEntries(
    
  Object.entries(MAP_PATHS).map(([code, path]) => [
    code,
    {
        code,
        name: COUNTRY_NAMES[code]?.name || code,
        path,
        neighbors: NEIGHBORS[code] || [],
        gdp: COUNTRY_NAMES[code]?.gdp
    }
  ])
);

// Helper functions
export const getCountry = (code: string): Country | undefined => {
  return COUNTRIES[code];
};

export const getAllCountries = (): Country[] => {
  return Object.values(COUNTRIES);
};

export const getNeighbors = (code: string): Country[] => {
  const country = COUNTRIES[code];
  if (!country) return [];
  return country.neighbors
    .map(neighborCode => COUNTRIES[neighborCode])
    .filter(Boolean);
};