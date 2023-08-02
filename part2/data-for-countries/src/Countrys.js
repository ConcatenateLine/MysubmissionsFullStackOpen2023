import Country from './Country'

const Countrys = ({countrys, country, handleCountryChange}) => {

    if (countrys.length > 10) {
        return <p>Too many matchas, specify another filter</p>
    }    
    if(country){
        return <Country country={country} />
    }
    return (
        countrys.map(country => <div key={country.name.common}>
            <p>{country.name.common} <button onClick={() => handleCountryChange(country)}>show</button></p>
        </div>)
    )
}

export default Countrys