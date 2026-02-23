import HegemonGraph from './HegemonGraph';
import PayoffsGraph from './PayoffsGraph';
import ScoresGraph from './ScoresGraph';
import './Graphs.css'

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
    <section className='results' aria-label='Simulation results and graphs'>
      <h2 className='result-title'>Results</h2>
      <hr className='divider'  aria-hidden='true'/>
      
      {/* Score Distribution - shows immediately after Prep Model */}
      {currentScores.length > 0 && (
        <>
          <h3>Scores</h3>
          <output  aria-label='Histogram showing score distribution across countries'>
            <ScoresGraph className='one-graph' data={currentScores}/>
          </output>
        </>
      )}

      {/* Payoffs Comparison - appears after first simulation step */}
      {payoffsHistory.length > 0 && (
        <>
          <h3>Payoffs</h3>
          <output ria-label='Line graph comparing average scores of hegemons versus other countries'>
            <PayoffsGraph className='one-graph' data={payoffsHistory}/>
          </output>
        </>
      )}

      {/* Hegemon Count Timeline - appears after first simulation step */}
      {hegemonHistory.length > 0 && (
        <>
          <h3>Hegemons</h3>
          <output aria-label='Line graph showing number of hegemons over time'>
            <HegemonGraph className='one-graph' data={hegemonHistory} />
          </output>
        </>
      )}
    </section>
  )
}

export default Graphs