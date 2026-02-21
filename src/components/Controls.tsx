import "./Controls.css"

interface ControlsProps {
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
}

const Controls = ({ 
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
  showLabels
}: ControlsProps) => {
  return (
    <div className="controls">
      {/* Setup & Export */}
      <div className="controls-setup">
        <button onClick={onSetup}>
          Strategy: {strategy === 'tit-for-tat' ? 'T4T' : strategy === 'always-cooperate' ? 'AllC' : 'AllD'}
        </button>
        <button 
          className="export-network"
          onClick={onExportNetwork}
        >
          Export Network
        </button>
      </div>

      {/* Configuration */}
      <div className="controls-config">
        <button className="toggle-labels" onClick={onToggleLabels}>
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        <button 
          className="prep-model"
          onClick={onPrepModel}
        >
          Prep Model
        </button>
      </div>

      {/* Simulation Controls */}
      <div className="controls-simulation">
        <button 
          className={`go ${isRunning ? "is-running" : ""}`} 
          onClick={onGo}
          disabled={!isModelPrepared}
        >
          {isRunning ? "Stop" : "Go"}
        </button>
        <button 
          className="go-once"
          onClick={onGoOnce}
          disabled={!isModelPrepared || isRunning}
        >
          Go Once
        </button>
        
        {/* Hegemons Monitor */}
        <div className="hegemons-monitor">
          <div className="monitor-label">Hegemons</div>
          <div className="monitor-value">{hegemonCount}</div>
        </div>
      </div>
    </div>
  )
}

export default Controls