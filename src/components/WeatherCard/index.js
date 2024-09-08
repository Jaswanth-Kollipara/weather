import {Link} from 'react-router-dom'
import './index.css'

const WeatherCard=props=>{
    const {weatherDetails}=props
    const {asciiName, countryCode, couNameEn, population, timezone}=weatherDetails

    return(
        <li className="weather-card-li-weather">
          <Link to={`/city/${asciiName}`} className="weather-card-link">
            <p className="weather-card-para1">{asciiName}</p>
          </Link>
            <p className="weather-card-para">{couNameEn}</p>
            <p className="weather-card-para">{countryCode}</p>
            <p className="weather-card-para">{timezone}</p>
            <p className="weather-card-para">{population}</p>
        </li>
    )
}

export default WeatherCard