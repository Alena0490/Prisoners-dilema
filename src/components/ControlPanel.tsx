import "./ControlPanel.css"
import Controls from "./Controls";
import Graphs from "./Graphs";

import { useState } from "react";
import { parseGDPFromCSV } from "../data/parseGDP";

interface ControlPanelProps {
  className?: string;
}

const ControlPanel = ({ className }: ControlPanelProps) => {
  const [gdpData, setGdpData] = useState<Record<string, number> | null>(null);

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const data = await parseGDPFromCSV(file);
    setGdpData(data);
  }
};
  return (
    <div className={className}>
      <h2>Control Panel</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    {gdpData && <p>Loaded {Object.keys(gdpData).length} countries</p>}
      <Controls />
      <Graphs />
    </div>
  )
}

export default ControlPanel
