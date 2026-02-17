import "./Controls.css"
interface ControlsProps {
  onSetup: () => void;
  onPrepModel: () => void;
  onGo: () => void;
  onGoOnce: () => void;
  hegemonCount: number;
  isRunning: boolean;
}

const Controls = ({ 
    onSetup, 
    onPrepModel, 
    onGo, 
    onGoOnce, 
    hegemonCount,
    isRunning 
}: ControlsProps) => {
  return (
    <div className="controls">
      <div className="controls-setup">
        <button 
         className="setup"
         onClick={onSetup}
        >
            Setup
        </button>

        <button className="export-network">Export Network</button>
      </div>

      <div className="controls-config">
        <button className="toggle-labels">Toggle Labels</button>
        <button 
            className="prep-model"
            onClick={onPrepModel}
        >Prep Model</button>
      </div>

      <div className="controls-simulation">
        <button 
         className={`go ${isRunning ? "is-running" : ""}`} 
         onClick={onGo}
        >
            {isRunning ? "Stop" : "Go"}
        </button>
        <button 
         className="go-once"
         onClick={onGoOnce}
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
