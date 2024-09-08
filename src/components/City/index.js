import {Component} from 'react'
import Loader from 'react-loader-spinner'
import { FaSun, FaCloudSun, FaCloudRain, FaCloud} from "react-icons/fa"
import { BsCloudSnowFill } from "react-icons/bs"
import { WiDayWindy } from "react-icons/wi"
import { RiSunFoggyLine } from "react-icons/ri"
import { TiWeatherStormy } from "react-icons/ti"
import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }


class City extends Component{
    state={
        weatherData: [],
        apiStatus: apiStatusConstants.initial,
    }

    componentDidMount() {
        this.getWeather()
    }

    getFormattedData=val=>({
        temp: val.temp,
        feelsLike: val.feels_like,
        tempMin: val.temp_min,
        tempMax: val.temp_max,
        pressure: val.pressure,
        humidity: val.humidity,
        seaLevel: val.sea_level,
        grndLevel: val.grnd_level,
    })
    
    getWeather = async () => {
        this.setState({
          apiStatus: apiStatusConstants.inProgress,
        })
        const {match} = this.props
        const {params} = match
        const {name} = params
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=5f535387bf010e27075a2017c4c12639`
        const response = await fetch(apiUrl)
        if (response.ok) {
          const fetchedData = await response.json()
          const updatedData = {
            coord: fetchedData.coord,
            weather: fetchedData.weather[0],
            base: fetchedData.base,
            main: this.getFormattedData(fetchedData.main),
            visibility: fetchedData.visibility,
            wind: fetchedData.wind,
            clouds: fetchedData.clouds,
            dt: fetchedData.dt,
            sys: fetchedData.sys,
            timezone: fetchedData.timezone,
            id: fetchedData.id,
            name: fetchedData.name,
            cod: fetchedData.cod,
          }
          this.setState({
            weatherData: updatedData,
            apiStatus: apiStatusConstants.success,
          })
        } else {
          this.setState({
            apiStatus: apiStatusConstants.failure,
          })
        }
      }

    renderWeatherView=()=>{
        const {weatherData}=this.state
        const {coord,weather,name,main,wind}=weatherData
        const {lon,lat}=coord
        const {description}=weather
        const {temp,humidity,pressure,tempMax,tempMin}=main
        const {speed}=wind
        const tempC=Math.round((temp-273.15)*100)/100
        const tempMaxC=Math.round((tempMax-273.15)*100)/100
        const tempMinC=Math.round((tempMin-273.15)*100)/100
        let back
        let icon
        if(description==="clear sky"){
            back="clear"
            icon=<FaSun />
        }
        else if(description==="snow"){
            back="snow"
            icon=<BsCloudSnowFill />
        }
        else if(description==="rainy"){
            back="rainy"
            icon=<FaCloudRain />
        }
        else if(description==="windy"){
            back="windy"
            icon=<WiDayWindy />
        }
        else if(description==="cloudy"  || description==="overcast clouds"){
            back="cloudy"
            icon=<FaCloud />
        }
        else if(description==="partialy cloudy"){
            back="par-cloudy"
            icon=<FaCloudSun />
        }
        else if(description==="foggy"){
            back="foggy"
            icon=<RiSunFoggyLine />
        }
        else if(description==="storm"){
            back="storm"
            icon=<TiWeatherStormy />
        }

        return (
            <div className={`city-card-container ${back}`}>
                <div className='city-container'>
                    <h1 className='city-card-heading'>Name:</h1>
                    <p className='city-card-para'>{name}</p>
                    <h1 className='city-card-heading'>longitude & latitude:</h1>
                    <p className='city-card-para'>{`${lon} lon & ${lat} lat`}</p>
                    <h1 className='city-card-heading'>Weather: </h1>
                    <p className='city-card-para disp'>{description} <span className='city-card-span'>{icon}</span></p>
                    <h1 className='city-card-heading'>Temperature: </h1>
                    <p className='city-card-para'>{`${tempC}°C`}</p>
                    <h1 className='city-card-heading'>Maximum Temperature & Minimum Temperature:</h1>
                    <p className='city-card-para'>{`${tempMaxC}°C & ${tempMinC}°C`}</p>
                    <h1 className='city-card-heading'>Humidity: </h1>
                    <p className='city-card-para'>{humidity}</p>
                    <h1 className='city-card-heading'>Atmospheric Pressure:</h1>
                    <p className='city-card-para'>{pressure}</p>
                    <h1 className='city-card-heading'>Wind Speed: </h1>
                    <p className='city-card-para'>{speed}</p>
                </div>
            </div>
        )
    }
    
    
    renderLoadingView = () => (
        <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
        </div>
    )

    renderFailureView = () => (
        <div className="products-error-view-container">
        <h1>Error</h1>
        </div>
    )
    
    renderAllItems = () => {
        const {apiStatus} = this.state
    
        switch (apiStatus) {
          case apiStatusConstants.success:
            return this.renderWeatherView()
          case apiStatusConstants.failure:
            return this.renderFailureView()
          case apiStatusConstants.inProgress:
            return this.renderLoadingView()
          default:
            return null
        }
      }
    
      render() {
        return <div>{this.renderAllItems()}</div>
      }
}

export default City