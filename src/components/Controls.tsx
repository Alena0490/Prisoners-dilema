import "./Controls.css"
interface ControlsProps {
  onSetup: () => void;
  strategy: 'tit-for-tat' | 'always-cooperate' | 'always-defect';
  onPrepModel: () => void;
  onExportNetwork: () => void;
  onGo: () => void;
  onGoOnce: () => void;
  hegemonCount: number;
  isModelPrepared: boolean
  isRunning: boolean;
  showLabels: boolean;
  onToggleLabels: () => void;
}

const Controls = ({ 
    onSetup, 
    strategy,
    onPrepModel, 
    onExportNetwork,
    onGo, 
    onGoOnce, 
    hegemonCount,
    isModelPrepared,
    isRunning,
    onToggleLabels,
    showLabels
}: ControlsProps) => {
  return (
    <div className="controls">
      <div className="controls-setup">
        <button onClick={onSetup}>
          Strategy: {strategy === 'tit-for-tat' ? 'T4T' : strategy === 'always-cooperate' ? 'AllC' : 'AllD'}
        </button>

        <button 
          className="export-network"
          onClick={onExportNetwork}
        >Export Network</button>
      </div>

      <div className="controls-config">
        <button className="toggle-labels" onClick={onToggleLabels}>
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        <button 
            className="prep-model"
            onClick={onPrepModel}
        >Prep Model</button>
      </div>

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
        <div className="hegemons-monitor">
          <div className="monitor-label">Hegemons</div>
          <div className="monitor-value">{hegemonCount}</div>
        </div>
      </div>
    </div>
  )
}

export default Controls
