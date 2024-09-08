import {useState, useEffect} from 'react'
import WeatherCard from '../WeatherCard'
import Loader from 'react-loader-spinner'
import './index.css'


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }

const Home =() =>{
  const [apiStatus,setApiStatus]=useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
    count: 0,
    limit: 20,
  })

  useEffect(()=>{
    window.addEventListener("scroll", ()=>{
      const sceolly=window.scrollY
      const scrollable=document.documentElement.scrollHeight-window.innerHeight
      if(scrollable*0.8<=sceolly){ 
        console.log('H')
        const{limit}=apiStatus
        console.log(limit)
        setApiStatus((prevApiStatus)=>({
          ...prevApiStatus,
          limit: prevApiStatus.limit +20,
        }))
      }
    })
  },[])

  const getWeather = async () => {
    setApiStatus({
      status: apiStatusConstants.inProgress,
      data: null,
      errorMsg: null,
    })
    const {limit}=apiStatus
    const apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${limit}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        totalCount: fetchedData.total_count,
        results: fetchedData.results.map(val => ({
          geonameId: val.geoname_id,
          name: val.name,
          asciiName: val.ascii_name,
          alternateNames: val.alternate_names,
          featureClass: val.feature_class,
          featureCode: val.feature_code,
          countryCode: val.country_code,
          couNameEn: val.cou_name_en,
          countryCode2: val.country_code_2,
          admin1Code: val.admin1_code,
          admin2Code: val.admin2_code,
          admin3Code: val.admin3_code,
          admin4Code: val.admin4_code,
          population: val.population,
          elevation: val.elevation,
          dem: val.dem,
          timezone: val.timezone,
          modificationDate: val.modification_date,
          labelEn: val.label_en,
          coordinates: val.coordinates,
        })),
      }
      setApiStatus((prevApiStatus)=>({
        ...prevApiStatus,
        status: apiStatusConstants.success,
        data: updatedData.results,
        count: updatedData.totalCount,
      }))
    } else {
      setApiStatus((prevApiStatus)=>({
        ...prevApiStatus,
        status: apiStatusConstants.failure,
      }))
    }
  }

  useEffect(() =>{
    getWeather()
  }, [])

  const renderWeatherView = () =>{
    const {data}=apiStatus
    return(
      <div>
        <ul className="home-ul-con">
          <li className="home-li-header">
            <h1 className='home-header'>City Name</h1>
            <h1 className='home-header'>Country</h1>
            <h1 className='home-header'>Country Code</h1>
            <h1 className='home-header'>Time Zome</h1>
            <h1 className='home-header'>Population</h1>
          </li>
          {data.map(item => (
            <WeatherCard
              weatherDetails={item}
              key={item.geonameId}
            />
          ))}
        </ul>
      </div>
    )
  }

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <h1>Error</h1>
    </div>
  )

  const renderAllItems = () => {
    const {status}=apiStatus
    switch (status) {
      case apiStatusConstants.success:
        return renderWeatherView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return <div>{renderAllItems()}</div>
}

export default Home
