import { useState, useEffect, useCallback  } from "react"
import { COUNTRIES } from "../data/countries"
import  type { Country } from "../data/countries";
import WorldMap from "./WorldMap"
import ControlPanel from "./ControlPanel"
import "../App.css"

const GeopoliticalSimulation = () => {
const [countries, setCountries] = useState(COUNTRIES);
const [isRunning, setIsRunning] = useState(false);
const [tick, setTick] = useState(0);
const [isModelPrepared, setIsModelPrepared] = useState(false);
const [showLabels, setShowLabels] = useState(false);

const handleSetup = () => {
  // TODO: Load GIS data (u nás už máme)
  console.log('Setup clicked');
};

const handlePrepModel = () => {
    // Set score = gdp for all countries
    const updatedCountries = Object.fromEntries(
    Object.entries(countries).map(([code, country]) => {
      // 1. Set score
      const score = Math.round((country.gdp || 0) / 1000000000);  // in bilions
      
      // 2. Find the highest score among neighbours
      const maxNeighborScore = Math.max(
        ...country.neighbors.map(nCode => Math.round((countries[nCode]?.gdp || 0) / 1000000000))
      );
      
      // 3. If my sccore > max neighbor score → hegemon = true
      const hegemon = score > maxNeighborScore; 
      setIsModelPrepared(true);
      
      return [
        code, { 
          ...country, 
          score, 
          hegemon, 
          playTable: Object.fromEntries(
            country.neighbors.map(nCode => [nCode, 'cooperate'])
          )  
        }
      ];
    }) 
  ) as Record<string, Country>;
      setCountries(updatedCountries);
      setTick(0);
  };

const handleToggleLabels = () => {
  setShowLabels(!showLabels);
};

  const runOneStep = useCallback(() => {
    // PHASE 1: Compute payoffs (USE old playTables)
    const scoresUpdate = Object.fromEntries(
      Object.entries(countries).map(([code, country]) => {
        let newScore = country.score || 0;
          
        // Calculate payoff for every neightbour
        country.neighbors.forEach(neighborCode => {
          const myAction = country.playTable?.[neighborCode]; 

          const theirAction = countries[neighborCode]?.playTable?.[code]; 

          // Calculate points from matrix
          if (myAction === 'cooperate' && theirAction === 'cooperate') {
            newScore += 2;  // C,C = 2,2
          } else if (myAction === 'cooperate' && theirAction === 'defect') {
            newScore += 0;  // C,D = 0,3
          } else if (myAction === 'defect' && theirAction === 'cooperate') {
            newScore += 3;  // D,C = 3,0
          } else {
            newScore += 0;  // D,D = 0,0
          }
        });     
        return [code, newScore];
      })
    );

    const updatedCountries = Object.fromEntries(
      Object.entries(countries).map(([code, country]) => {
        const myScore = scoresUpdate[code] || 0;

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

          // Copy old playTable (TFT memory)
          const playTable: Record<string, 'cooperate' | 'defect'> = { 
            ...country.playTable 
          };

          // Update based on what neighbors played last round (TFT)
          country.neighbors.forEach(nCode => {
            const theirLastAction = countries[nCode]?.playTable?.[code];
            if (theirLastAction) {
              playTable[nCode] = theirLastAction;  // Tit-for-Tat!
            } else {
              playTable[nCode] = 'cooperate';  // Default
            }
          });

          // Defect against rivals (overrides TFT)
          if (nextStrongest) playTable[nextStrongest] = 'defect';
          if (nextWeakest) playTable[nextWeakest] = 'defect';
          
          return [code, { 
            ...country, 
            score: scoresUpdate[code], 
            ranking, 
            nextStrongest, 
            nextWeakest, 
            hegemon, 
            playTable 
          }];
        })
      );

    setCountries(updatedCountries);
    setTick(tick + 1);
    // Apply scores
   // TODO: přidej scores z scoresUpdate do updatedCountries
}, [countries, tick ]);

  const handleGo = () => {
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
      <WorldMap 
        className="world-map-container" 
        countries={countries} 
        showLabels={showLabels} 
      />
      <ControlPanel className="control-panel" 
        onSetup={handleSetup}
        onPrepModel={handlePrepModel}
        onGo={handleGo}
        onGoOnce={handleGoOnce}
        hegemonCount={countHegemons()}
        isModelPrepared={isModelPrepared}
        isRunning={isRunning}
        onToggleLabels={handleToggleLabels}
        showLabels={showLabels}
  />
    </div>
  )
}

export default GeopoliticalSimulation