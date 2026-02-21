import { useState, useEffect, useCallback  } from "react"
import { COUNTRIES } from "../data/countries"
import  type { Country } from "../data/countries";
import WorldMap from "./WorldMap"
import ControlPanel from "./ControlPanel"
import "../App.css"

const GeopoliticalSimulation = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Simulation data
  const [countries, setCountries] = useState(COUNTRIES);
  const [tick, setTick] = useState(0);

  // UI control
  const [isRunning, setIsRunning] = useState(false);
  const [isModelPrepared, setIsModelPrepared] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  // Strategy configuration
  const [strategy, setStrategy] = useState<'tit-for-tat' | 'always-cooperate' | 'always-defect'>('tit-for-tat');

  // Historical data for graphs
  const [hegemonHistory, setHegemonHistory] = useState<number[]>([]);
  const [payoffsHistory, setPayoffsHistory] = useState<{hegemonAvg: number, otherAvg: number}[]>([]);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const currentScores = Object.values(countries)
    .map(c => c.score || 0)
    .filter(s => s > 0);

  const countHegemons = () => {
    return Object.values(countries).filter(country => country.hegemon).length;
  };

  // ============================================
  // INITIALIZATION & SETUP
  // ============================================
  
  const handlePrepModel = () => {
    const updatedCountries = Object.fromEntries(
      Object.entries(countries).map(([code, country]) => {
        const score = Math.round((country.gdp || 0) / 1000000000);
        
        const maxNeighborScore = Math.max(
          ...country.neighbors.map(nCode => Math.round((countries[nCode]?.gdp || 0) / 1000000000))
        );
        
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

  const handleSetup = () => {
    const strategies = ['tit-for-tat', 'always-cooperate', 'always-defect'] as const;
    const currentIndex = strategies.indexOf(strategy);
    const nextStrategy = strategies[(currentIndex + 1) % 3];
    setStrategy(nextStrategy);
    handlePrepModel();
  };

  const handleExportNetwork = () => {
    let csv = 'Country,Code,Neighbors\n';
    
    Object.entries(countries).forEach(([code, country]) => {
      const neighbors = country.neighbors.join(',');
      csv += `"${country.name}",${code},"${neighbors}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'geopolitical-network.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // ============================================
  // SIMULATION LOGIC
  // ============================================
  
  const runOneStep = useCallback(() => {
    // PHASE 1: Compute payoffs
    const scoresUpdate = Object.fromEntries(
      Object.entries(countries).map(([code, country]) => {
        let newScore = country.score || 0;
          
        country.neighbors.forEach(neighborCode => {
          const myAction = country.playTable?.[neighborCode]; 
          const theirAction = countries[neighborCode]?.playTable?.[code]; 

          if (myAction === 'cooperate' && theirAction === 'cooperate') {
            newScore += 2;
          } else if (myAction === 'cooperate' && theirAction === 'defect') {
            newScore += 0;
          } else if (myAction === 'defect' && theirAction === 'cooperate') {
            newScore += 3;
          } else {
            newScore += 0;
          }
        });     
        return [code, newScore];
      })
    );

    // PHASE 2: Update assessments and strategies
    const updatedCountries = Object.fromEntries(
      Object.entries(countries).map(([code, country]) => {
        const myScore = scoresUpdate[code] || 0;

        const ranking = country.neighbors
          .filter(nCode => {
            const neighbor = countries[nCode];
            return (neighbor?.score ?? 0) < myScore;
          })
          .length + 1;

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

        const hegemon = nextStrongest === undefined;

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
        } else {
          country.neighbors.forEach(nCode => {
            const theirLastAction = countries[nCode]?.playTable?.[code];
            if (theirLastAction) {
              playTable[nCode] = theirLastAction;
            } else {
              playTable[nCode] = 'cooperate';
            }
          });
        }

        // Defect against rivals
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

    // PHASE 3: Update state and history
    setCountries(updatedCountries);
    setTick(tick + 1);
    
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

  // ============================================
  // UI HANDLERS
  // ============================================
  
  const handleGo = () => {
    setIsRunning(!isRunning); 
  };

  const handleGoOnce = () => {
    runOneStep(); 
  };

  const handleToggleLabels = () => {
    setShowLabels(!showLabels);
  };

  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      runOneStep();
    }, 100);
    
    return () => clearInterval(interval); 
  }, [isRunning, runOneStep ]); 

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="simulation-wrapper">
      <section className="simulation-header">
          <h1>Geopolitical Simulation</h1>
          <p>Agent-based model exploring how countries interact through Prisoner's Dilemma strategies in a global network.</p>
      </section>
      <div className="geopolitical-simulation">
        <WorldMap 
          className="world-map-container" 
          countries={countries} 
          showLabels={showLabels} 
        />
        <ControlPanel 
          className="control-panel" 
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
    </div>
  )
}

export default GeopoliticalSimulation