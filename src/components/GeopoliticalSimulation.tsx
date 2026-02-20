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
const [hegemonHistory, setHegemonHistory] = useState<number[]>([]);
const [payoffsHistory, setPayoffsHistory] = useState<{hegemonAvg: number, otherAvg: number}[]>([]);
const [strategy, setStrategy] = useState<'tit-for-tat' | 'always-cooperate' | 'always-defect'>('tit-for-tat');

const currentScores = Object.values(countries)
  .map(c => c.score || 0)
  .filter(s => s > 0);

const handleSetup = () => {
  const strategies = ['tit-for-tat', 'always-cooperate', 'always-defect'] as const;
  const currentIndex = strategies.indexOf(strategy);
  const nextStrategy = strategies[(currentIndex + 1) % 3];
  setStrategy(nextStrategy);
  
  // Reset simulace
  handlePrepModel();
};

const handleExportNetwork = () => {
  // CSV header
  let csv = 'Country,Code,Neighbors\n';
  
  // Data rows
  Object.entries(countries).forEach(([code, country]) => {
    const neighbors = country.neighbors.join(',');
    csv += `"${country.name}",${code},"${neighbors}"\n`;
  });
  
  // Create download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'geopolitical-network.csv';
  link.click();
  URL.revokeObjectURL(url);
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
      setHegemonHistory([]);
      setPayoffsHistory([]);
      
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

          // Apply strategy
          if (strategy === 'always-cooperate') {
            country.neighbors.forEach(nCode => {
              playTable[nCode] = 'cooperate';
            });
          } else if (strategy === 'always-defect') {
            country.neighbors.forEach(nCode => {
              playTable[nCode] = 'defect';
            });
          } else { // tit-for-tat
            country.neighbors.forEach(nCode => {
              const theirLastAction = countries[nCode]?.playTable?.[code];
              if (theirLastAction) {
                playTable[nCode] = theirLastAction;
              } else {
                playTable[nCode] = 'cooperate';
              }
            });
          }

          // Defect against rivals (overrides all strategies)
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
    const currentHegemonCount = Object.values(updatedCountries).filter(c => c.hegemon).length;
    
    const hegemons = Object.values(updatedCountries).filter(c => c.hegemon);
    const others = Object.values(updatedCountries).filter(c => !c.hegemon);

    const hegemonAvg = hegemons.length > 0 
      ? hegemons.reduce((sum, c) => sum + (c.score || 0), 0) / hegemons.length 
      : 0;

    const otherAvg = others.length > 0
      ? others.reduce((sum, c) => sum + (c.score || 0), 0) / others.length
      : 0;

    setPayoffsHistory(prev => [...prev, { hegemonAvg, otherAvg }]);

    setHegemonHistory(prev => [...prev, currentHegemonCount]);
}, [countries, tick, strategy]); 

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
        strategy={strategy}
        onPrepModel={handlePrepModel}
        onExportNetwork={handleExportNetwork}
        onGo={handleGo}
        onGoOnce={handleGoOnce}
        hegemonCount={countHegemons()}
        hegemonHistory={hegemonHistory}
        payoffsHistory={payoffsHistory}
        currentScores={currentScores}
        isModelPrepared={isModelPrepared}
        isRunning={isRunning}
        onToggleLabels={handleToggleLabels}
        showLabels={showLabels}
  />
    </div>
  )
}

export default GeopoliticalSimulation