import Weather from "./Weather";

const Country = ({country})=>{
    return (
        <div>
            <h3>{country.name.official}</h3>
            <p><span>Capital: </span>{country.capital}</p>
            <p><span>Area: </span>{country.area}</p>
            <p>Languages:</p>
             <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
             </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <Weather countryName={country.name.official} capitalInfo={country.capitalInfo.latlng} />
        </div>
    )
}

export default Country