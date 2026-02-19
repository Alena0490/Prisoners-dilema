import "./ControlPanel.css"
import Controls from "./Controls";
import Graphs from "./Graphs";

interface ControlPanelProps {
  className?: string;
  onSetup: () => void;
  onPrepModel: () => void;
  onGo: () => void;
  onGoOnce: () => void;
  hegemonCount: number;
  isModelPrepared: boolean;
  isRunning: boolean;
  showLabels: boolean;
  onToggleLabels: () => void;
}

const ControlPanel = ({ 
  className, 
  onSetup, 
  onPrepModel, 
  onGo, 
  onGoOnce, 
  hegemonCount,
  isModelPrepared,
  isRunning,
  onToggleLabels,
  showLabels

}: ControlPanelProps) => {
  return (
    <div className={className}>
      <h2>Setup</h2>
      <Controls 
        onSetup={onSetup}
        onPrepModel={onPrepModel}
        onGo={onGo}
        onGoOnce={onGoOnce}
        hegemonCount={hegemonCount}
        isModelPrepared={isModelPrepared}
        isRunning={isRunning}
        onToggleLabels={onToggleLabels}
        showLabels={showLabels}
  />
      <Graphs />
    </div>
  )
}

export default ControlPanel