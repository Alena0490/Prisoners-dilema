import { useState } from "react"
import { parseGDPFromCSV } from "../data/parseGDP";
import WorldMap from "./WorldMap"
import ControlPanel from "./ControlPanel"
import "../App.css"

const GeopoliticalSimulation = () => {
  import { MAP_PATHS } from '../data/worldMapPaths';
  import { COUNTRY_NAMES } from '../data/countryNames';
  import { NEIGHBORS } from '../data/neighbors';
  
  export interface Country {
    code: string;
    name: string;
    path: string;
    neighbors: string[];
    strategy?: 'C' | 'D';
    score?: number;
    totalScore?: number;
    gdp?: number; 
  }
  
  // Automatically generate the COUNTRIES object based on MAP_PATHS, COUNTRY_NAMES, and NEIGHBORS data    
  export const COUNTRIES: Record<string, Country> = Object.fromEntries(
    const [gdpData, setGdpData] = useState<Record<string, number> | null>(null);
  
          const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
              const data = await parseGDPFromCSV(file);
              setGdpData(data);
          }
          };
  
          // Když máš GDP data, přidej je ke countries:
          const enrichCountriesWithGDP = () => {
          if (!gdpData) return COUNTRIES;
          
          const minGDP = Math.min(...Object.values(gdpData));
          
          return Object.fromEntries(
              Object.entries(COUNTRIES).map(([code, country]) => [
              code,
              {
                  ...country,
                  gdp: gdpData[code] || minGDP
              }
              ])
          );
          };
  
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

  return (
    <div className="geopolitical-simulation">
      <WorldMap  className="world-map-container" />
      <ControlPanel className ="control-panel" />
    </div>
  )
}

export default GeopoliticalSimulation
