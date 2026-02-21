import HegemonGraph from './HegemonGraph';
import PayoffsGraph from './PayoffsGraph';
import ScoresGraph from './ScoresGraph';
import "./Graphs.css"

interface GraphsProps {
  // Historical data
  hegemonHistory: number[];
  payoffsHistory: {hegemonAvg: number, otherAvg: number}[];
  
  // Current snapshot
  currentScores: number[];
}

const Graphs = ({
  hegemonHistory,
  payoffsHistory,
  currentScores
}: GraphsProps) => {
  return (
    <div className='results'>
      <h2 className='result-title'>Results</h2>
      <hr className='divider'/>
      
      {/* Score Distribution - shows immediately after Prep Model */}
      {currentScores.length > 0 && (
        <>
          <h3>Scores</h3>
          <output>
            <ScoresGraph className='one-graph' data={currentScores}/>
          </output>
        </>
      )}

      {/* Payoffs Comparison - appears after first simulation step */}
      {payoffsHistory.length > 0 && (
        <>
          <h3>Payoffs</h3>
          <output>
            <PayoffsGraph className='one-graph' data={payoffsHistory}/>
          </output>
        </>
      )}

      {/* Hegemon Count Timeline - appears after first simulation step */}
      {hegemonHistory.length > 0 && (
        <>
          <h3>Hegemons</h3>
          <output>
            <HegemonGraph className='one-graph' data={hegemonHistory} />
          </output>
        </>
      )}
    </div>
  )
}

export default Graphs