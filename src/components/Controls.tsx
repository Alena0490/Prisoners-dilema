import "./Controls.css"
const Controls = () => {
  return (
    <div className="controls">
      <div className="controls-setup">
        <button className="setup">Setup</button>
        <button className="export-network">Export Network</button>
      </div>
      <div className="controls-config">
        <button className="toggle-labels">Toggle Labels</button>
        <button className="prep-model">Prep Model</button>
      </div>
      <div className="controls-simulation">
        <button className="go">Go</button>
        <button className="go-once">Go Once</button>
        <div className="hegemons-monitor">
          <div className="monitor-label">Hegemons</div>
          <div className="monitor-value">0</div>
        </div>
      </div>
    </div>
  )
}

export default Controls
