import "./ControlPanel.css"
import Controls from "./Controls";
import Graphs from "./Graphs";

interface ControlPanelProps {
  className?: string;
}

const ControlPanel = ({ className }: ControlPanelProps) => {
  return (
    <div className={className}>
      <h2>Control Panel</h2>
      <Controls />
      <Graphs />
    </div>
  )
}

export default ControlPanel