import "./ControlPanel.css"
import Controls from "./Controls";
import Graphs from "./Graphs";

interface ControlPanelProps {
  className?: string;
  
  // Event handlers
  onSetup: () => void;
  onPrepModel: () => void;
  onExportNetwork: () => void;
  onGo: () => void;
  onGoOnce: () => void;
  onToggleLabels: () => void;
  
  // Strategy configuration
  strategy: 'tit-for-tat' | 'always-cooperate' | 'always-defect';
  
  // Simulation state
  hegemonCount: number;
  isModelPrepared: boolean;
  isRunning: boolean;
  
  // UI state
  showLabels: boolean;
  
  // Historical data for graphs
  hegemonHistory: number[];
  payoffsHistory: {hegemonAvg: number, otherAvg: number}[];
  currentScores: number[];
}

const ControlPanel = ({ 
  className,
  
  // Event handlers
  onSetup,
  onPrepModel,
  onExportNetwork,
  onGo,
  onGoOnce,
  onToggleLabels,
  
  // Strategy configuration
  strategy,
  
  // Simulation state
  hegemonCount,
  isModelPrepared,
  isRunning,
  
  // UI state
  showLabels,
  
  // Historical data
  hegemonHistory,
  payoffsHistory,
  currentScores
}: ControlPanelProps) => {
  return (
    <div className={className}>
      <h2>Setup</h2>
      <div className="instructions">
          <div className="strategy-legend">
            <span className="legend-item"><strong>T4T:</strong> Tit-for-Tat</span>
            <span className="legend-item"><strong>AllC:</strong> Always Cooperate</span>
            <span className="legend-item"><strong>AllD:</strong> Always Betray</span>
          </div>
        </div>
      
      <Controls 
        onSetup={onSetup}
        strategy={strategy}
        onPrepModel={onPrepModel}
        onExportNetwork={onExportNetwork}
        onGo={onGo}
        onGoOnce={onGoOnce}
        hegemonCount={hegemonCount}
        isModelPrepared={isModelPrepared}
        isRunning={isRunning}
        onToggleLabels={onToggleLabels}
        showLabels={showLabels}
      />
      
      <Graphs 
        hegemonHistory={hegemonHistory} 
        payoffsHistory={payoffsHistory}
        currentScores={currentScores}
      />
    </div>
  )
}

export default ControlPanel