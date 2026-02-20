import "./ControlPanel.css"
import Controls from "./Controls";
import Graphs from "./Graphs";

interface ControlPanelProps {
  className?: string;
  onSetup: () => void;
  strategy: 'tit-for-tat' | 'always-cooperate' | 'always-defect';
  onPrepModel: () => void;
  onExportNetwork: () => void;
  onGo: () => void;
  onGoOnce: () => void;
  hegemonCount: number;
  isModelPrepared: boolean;
  isRunning: boolean;
  showLabels: boolean;
  onToggleLabels: () => void;
  hegemonHistory: number[];
  payoffsHistory: {hegemonAvg: number, otherAvg: number}[]
  currentScores: number[];
}

const ControlPanel = ({ 
  className, 
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
  showLabels,
  hegemonHistory,
  payoffsHistory,
  currentScores
}: ControlPanelProps) => {
  return (
    <div className={className}>
      <h2>Setup</h2>
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