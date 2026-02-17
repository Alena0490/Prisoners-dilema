import { useState, useEffect, useCallback  } from "react"
import { COUNTRIES } from "../data/countries"
import WorldMap from "./WorldMap"
import ControlPanel from "./ControlPanel"
import "../App.css"

const GeopoliticalSimulation = () => {
const [countries, setCountries] = useState(COUNTRIES);
const [isRunning, setIsRunning] = useState(false);
const [tick, setTick] = useState(0);

const handleSetup = () => {
  // TODO: Load GIS data (u nás už máme)
  console.log('Setup clicked');
};

const handlePrepModel = () => {
    // Set score = gdp for all countries
    const updatedCountries = Object.fromEntries(
    Object.entries(countries).map(([code, country]) => {
      // 1. Set score
      const score = country.gdp || 0;
      
      // 2. Find the highest score among neighbours
      const maxNeighborScore = Math.max(
        ...country.neighbors.map(nCode => countries[nCode]?.gdp || 0)
      );
      
      // 3. If my sccore > max neighbor score → hegemon = true
      const hegemon = score > maxNeighborScore; 
      
      return [code, { ...country, score, hegemon }];
})
);
    setCountries(updatedCountries);
    setTick(0);
    console.log('Prep Model clicked');
  };

  const runOneStep = useCallback(() => {

  const updatedCountries = Object.fromEntries(
    Object.entries(countries).map(([code, country]) => {
      const myScore = country.score || 0;

      const ranking = country.neighbors
      .filter(nCode => {
        const neighbor = countries[nCode];
        return (neighbor?.score ?? 0) < myScore;
      })
      .length + 1;

      //Next strongest
      const strongerNeighbors = country.neighbors.filter(nCode => {
        const neighbor = countries[nCode];
        return (neighbor?.score ?? 0) > myScore;
      });

      const nextStrongest = strongerNeighbors.length > 0
        ? strongerNeighbors.reduce((closest, nCode) => {
            const closestScore = countries[closest]?.score ?? Infinity;
            const currentScore = countries[nCode]?.score ?? Infinity;
            return currentScore < closestScore ? nCode : closest;
          }, strongerNeighbors[0])
        : undefined;

      //Next weakest
      const weakerNeighbors = country.neighbors.filter(nCode => {
        const neighbor = countries[nCode];
        return (neighbor?.score ?? 0) < myScore;
      });

      const nextWeakest = weakerNeighbors.length > 0
        ? weakerNeighbors.reduce((closest, nCode) => {
            const closestScore = countries[closest]?.score ?? -Infinity;
            const currentScore = countries[nCode]?.score ?? -Infinity;
            return currentScore > closestScore ? nCode : closest;
          }, weakerNeighbors[0])
        : undefined;

        // Update hegemon status
        const hegemon = nextStrongest === undefined;
        
        return [code, { ...country, ranking, nextStrongest, nextWeakest, hegemon }];
      })
    );

  setCountries(updatedCountries);
  setTick(tick + 1);
}, [countries, tick]);

  const handleGo = () => {
    // TODO: Start continuous simulation
    setIsRunning(!isRunning); 
  };

  const handleGoOnce = () => {
    runOneStep(); 
  };

  const countHegemons = () => {
    return Object.values(countries).filter(country => country.hegemon).length;
  };

  useEffect(() => {
  if (!isRunning) return;
  
  const interval = setInterval(() => {
    runOneStep();
  }, 100);
  
  return () => clearInterval(interval); 
}, [isRunning, runOneStep ]); 

  return (
    <div className="geopolitical-simulation">
      <WorldMap className="world-map-container" />
      <ControlPanel className="control-panel" 
        onSetup={handleSetup}
        onPrepModel={handlePrepModel}
        onGo={handleGo}
        onGoOnce={handleGoOnce}
        hegemonCount={countHegemons()}
        isRunning={isRunning}
  />
    </div>
  )
}

export default GeopoliticalSimulation