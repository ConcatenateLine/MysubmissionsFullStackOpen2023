import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine  = props => <tr><td>{props.name}</td><td>{props.value}</td></tr>

const Statistics = (props) => {

  const total = props.good+props.neutral+props.bad;
  const average = (props.good*1+props.neutral*0+props.bad*-1)/total;
  const positive = props.good*100/(props.good+props.neutral+props.bad);

  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticLine name="good" value={props.good} />
        <StatisticLine name="neutral" value={props.neutral} />
        <StatisticLine name="bad" value={props.bad} />
        <StatisticLine name="all" value={total} />
        <StatisticLine name="average" value={average} />
        <StatisticLine name="positive" value={`${positive} %`} />
      </tbody>      
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good+1)} text="good" />
      <Button handleClick={() => setNeutral(neutral+1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App