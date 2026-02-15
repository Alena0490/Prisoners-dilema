
import WorldMap from "./WorldMap"
import ControlPanel from "./ControlPanel"
import "../App.css"

const GeopoliticalSimulation = () => {
  return (
    <div className="geopolitical-simulation">
      <WorldMap  className="world-map-container" />
      <ControlPanel className ="control-panel" />
    </div>
  )
}

export default GeopoliticalSimulation
