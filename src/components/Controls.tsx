import './Controls.css'

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
    <div className='controls'>
      {/* Setup & Export */}
      <div className='controls-setup'>
        <button onClick={onSetup}>
          Strategy: {strategy === 'tit-for-tat' ? 'T4T' : strategy === 'always-cooperate' ? 'AllC' : 'AllD'}
        </button>
        <button 
          className='export-network'
          onClick={onExportNetwork}
          aria-label='Export network topology as CSV file'
        >
          Export Network
        </button>
      </div>

      {/* Configuration */}
      <div 
        className='controls-config'
        role='group' 
        aria-label='Display configuration'
      >
        <button 
          className='toggle-labels'
          onClick={onToggleLabels}
          aria-label={showLabels ? 'Hide score labels on map' : 'Show score labels on map'}
          aria-pressed={showLabels} 
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        <button 
          className='prep-model'
          onClick={onPrepModel}
          aria-label='Initialize simulation with GDP values'
        >
          Prep Model
        </button>
      </div>

      {/* Simulation Controls */}
      <div 
        className='controls-simulation'
        role='group' 
        aria-label='Simulation execution'
      >
        <button 
          className={`go ${isRunning ? 'is-running' : ''}`} 
          onClick={onGo}
          aria-label={isRunning ? 'Stop continuous simulation' : 'Start continuous simulation'}
          disabled={!isModelPrepared}
        >
          {isRunning ? 'Stop' : 'Go'}
        </button>
        <button 
          className='go-once'
          onClick={onGoOnce}
          disabled={!isModelPrepared || isRunning}
          aria-label='Run one simulation step'
        >
          Go Once
        </button>
        
        {/* Hegemons Monitor */}
        <div 
          className='hegemons-monitor'
          role='status'
          aria-live='polite'
          aria-label='Hegemon count display'
        >
          <div className='monitor-label'>Hegemons</div>
          <div 
            className='monitor-value'
            role='status'
          aria-live='polite'
          aria-label='Hegemon count display'
        >{hegemonCount}</div>
        </div>
      </div>
    </div>
  )
}

export default Controls