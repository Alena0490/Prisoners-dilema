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
}

// Automatically generate the COUNTRIES object based on MAP_PATHS, COUNTRY_NAMES, and NEIGHBORS data    
export const COUNTRIES: Record<string, Country> = Object.fromEntries(
  Object.entries(MAP_PATHS).map(([code, path]) => [
    code,
    {
      code,
      name: COUNTRY_NAMES[code] || code,
      path,
      neighbors: NEIGHBORS[code] || [],
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