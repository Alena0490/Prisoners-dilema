import "./ControlPanel.css"

interface ControlPanelProps {
  className?: string;
}

const ControlPanel = ({ className }: ControlPanelProps) => {
  return (
    <div className={className}>
      <h2>Control Panel</h2>
    </div>
  )
}

export default ControlPanel
