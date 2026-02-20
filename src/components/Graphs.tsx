import HegemonGraph from './HegemonGraph';
import PayoffsGraph from './PayoffsGraph';
import ScoresGraph from './ScoresGraph';
import "./Graphs.css"

interface hegemonHistoryProps {
  hegemonHistory: number[] 
  payoffsHistory: {hegemonAvg: number, otherAvg: number}[]
  currentScores: number[];
}

const Graphs = ({hegemonHistory, payoffsHistory, currentScores}: hegemonHistoryProps) => {
  return (
    <div className='results'>
      <h2 className='result-title'>Results</h2>
      <hr className='divider'/>
      {currentScores.length > 0 && (
      <>
        <h3>Scores</h3>
        <output>
            <ScoresGraph className='one-graph'  data={currentScores}/>
        </output>
        </>
      )}

      {payoffsHistory.length > 0 && (
      <>
        <h3>Payoffs</h3>
        <output>
            <PayoffsGraph className='one-graph'  data={payoffsHistory}/>
          </output>
        </>
      )}

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
