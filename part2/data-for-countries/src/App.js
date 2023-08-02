import {useState,useEffect} from 'react'
import axios from 'axios'
import Filter from './Filter'
import Countrys from './Countrys'

function App() {
  const [countrys,setCountrys] = useState([])
  const [country,setCountry] = useState(null)
  const [filter, setFilter] = useState('')

  const countrysToShow = filter === ''
  ? countrys
  : countrys.filter(country => country.name.common.toLowerCase().match(`^${filter}`))

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setCountry(null)
  }  

  const handleCountryChange = (country) => {    
    setCountry(country)
  }

  
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountrys(response.data)
      })
  }, [])

  return (
    <div className="App">
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countrys countrys={countrysToShow} country={country} handleCountryChange={handleCountryChange} />
    </div>
  );
}

export default App;
