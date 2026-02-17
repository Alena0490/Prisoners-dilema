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
  isRunning: boolean
}

const ControlPanel = ({ 
  className, 
  onSetup, 
  onPrepModel, 
  onGo, 
  onGoOnce, 
  hegemonCount,
  isRunning
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
        isRunning={isRunning}
  />
      <Graphs />
    </div>
  )
}

export default ControlPanel