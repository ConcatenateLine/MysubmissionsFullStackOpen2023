import axios from "axios"
import { useEffect,useState } from "react"

const Weather = ({countryName,capitalInfo})=>{
    const api_key = process.env.REACT_APP_API_KEY
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${capitalInfo[0]}&lon=${capitalInfo[1]}&appid=${api_key}`)
        .then(response => {
            setWeather(response.data)
          })
          .catch(error => {
            console.log(error);
          })
    }, [])
    
    if (!weather) {
        return <p>weather error</p>
    }
    return (
        <div>
            <h3>Weather in {countryName}</h3>
            <p><span>Temperature: </span>{weather.main.temp} °c</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="img" />
            <p><span>wind: </span>{weather.wind.speed} m/s</p>            
        </div>
    )
}

export default Weather