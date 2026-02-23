import './Controls.css'

// ============================================
// TYPES
// ============================================

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

// ============================================
// COMPONENT
// ============================================

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

  // ============================================
  // HANDLERS
  // ============================================

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className='controls'>
      {/* Setup & Export */}
      <div className='controls-setup'>
        <button 
          onMouseDown={handleRipple}
          onClick={onSetup}
        >
          Strategy: {strategy === 'tit-for-tat' ? 'T4T' : strategy === 'always-cooperate' ? 'AllC' : 'AllD'}
        </button>
        <button 
          className='export-network'
          onMouseDown={handleRipple}
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
          onMouseDown={handleRipple}
          onClick={onToggleLabels}
          aria-label={showLabels ? 'Hide score labels on map' : 'Show score labels on map'}
          aria-pressed={showLabels} 
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        <button 
          className='prep-model'
          onMouseDown={handleRipple}
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
          onMouseDown={handleRipple}
          onClick={onGo}
          aria-label={isRunning ? 'Stop continuous simulation' : 'Start continuous simulation'}
          disabled={!isModelPrepared}
        >
          {isRunning ? 'Stop' : 'Go'}
        </button>
        <button 
          className='go-once'
          onMouseDown={handleRipple}
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
          >
            {hegemonCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;