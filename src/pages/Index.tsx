import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/components/LeafletFix.css';
import L from 'leaflet';
import Header from "@/components/Header";
import AveragePollution from "@/components/AveragePollution";
import PollutionUnits from "@/components/PollutionUnits";
import ForecastWidget from "@/components/ForecastWidget";
import HistoricalChart from "@/components/HistoricalChart";
import AQICard from "@/components/AQICard";



import { airQualityAPI } from "@/services/airQualityAPI";
import { Clock, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// AQI Categories and colors
const aqiCategories = [{
  name: "Good",
  color: "#4ade80",
  range: "0-50"
}, {
  name: "Moderate",
  color: "#facc15",
  range: "51-100"
}, {
  name: "Unhealthy",
  color: "#ef4444",
  range: "101-200"
}, {
  name: "Very Unhealthy",
  color: "#ec4899",
  range: "201-300"
}, {
  name: "Hazardous",
  color: "#7e22ce",
  range: "301+"
}];

interface CityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  category: string;
  mainPollutant: string;
  mainPollutantValue: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentCityData, setCurrentCityData] = useState<CityData>({
    name: "Jakarta",
    country: "Indonesia",
    lat: -6.223099,
    lng: 106.791597,
    aqi: 85,
    category: "Moderate",
    mainPollutant: "PM2.5",
    mainPollutantValue: 53,
    temperature: 29,
    humidity: 56,
    windSpeed: 1.1
  });
  const [averageAQI, setAverageAQI] = useState(0);
  const [pollutionUnits, setPollutionUnits] = useState({
    pm25: 0,
    pm10: 0,
    o3: 0,
    no2: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Custom onTabChange function to handle navigation
  const handleTabChange = (tab: string) => {
    if (tab === 'forecast') {
      setActiveTab('home');
      setTimeout(() => scrollToSection('forecast-section'), 100);
    } else if (tab === 'graph') {
      setActiveTab('home');
      setTimeout(() => scrollToSection('history-section'), 100);
    } else if (tab === 'stations') {
      window.location.href = '/stations';
    } else {
      setActiveTab(tab);
    }
  };

  // Load last searched city from localStorage or default to Jakarta
  useEffect(() => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
      try {
        const cityData = JSON.parse(lastCity);
        setCurrentCityData(cityData);
        setAverageAQI(cityData.aqi);
      } catch (error) {
        console.error('Error parsing last city data:', error);
      }
    }
    loadAirQualityData();
  }, []);

  const loadAirQualityData = async () => {
    try {
      setIsLoading(true);

      // Generate mock data for now (this can be updated when webhook provides pollutant data)
      const unitsData = airQualityAPI.generatePollutionUnitsData();
      setPollutionUnits(unitsData);
      // Average AQI is now set when city data is loaded
    } catch (error) {
      console.error("Error loading air quality data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Geocoding function using Nominatim (kept for reference, not currently used)
  // const geocodeCity = async (cityName: string) => {
  //   try {
  //     const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
  //     const data = await response.json();
  //     if (data.length > 0) {
  //       const result = data[0];
  //       return {
  //         lat: parseFloat(result.lat),
  //         lng: parseFloat(result.lon),
  //         displayName: result.display_name
  //       };
  //     }
  //     throw new Error('City not found');
  //     } catch (error) {
  //       console.error('Geocoding error:', error);
  //       throw error;
  //     }
  // };

  // Function to fetch air quality and weather data from Make webhook
  const fetchCityDataFromWebhook = async (cityName: string): Promise<CityData> => {
    try {
      console.log(`Fetching data for city: ${cityName}`);
      
      const response = await fetch('https://hook.eu2.make.com/lc1hratujpvj68rm1by4179k4osec9vc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response:', data);
      
      if (!data.success) {
        throw new Error('Failed to fetch city data from webhook');
      }

      // Validate required fields
      if (!data.city || !data.country || !data.coords || !data.aqi || !data.weather) {
        throw new Error('Invalid data structure received from webhook');
      }

      // Determine category based on AQI
      let category = "Good";
      if (data.aqi <= 50) category = "Good";
      else if (data.aqi <= 100) category = "Moderate";
      else if (data.aqi <= 200) category = "Unhealthy";
      else if (data.aqi <= 300) category = "Very Unhealthy";
      else category = "Hazardous";

      // Convert the webhook response to our CityData format
      const cityData: CityData = {
        name: data.city,
        country: data.country,
        lat: parseFloat(data.coords.lat),
        lng: parseFloat(data.coords.lon),
        aqi: data.aqi,
        category: category,
        mainPollutant: "PM2.5", // Default value, can be updated if webhook provides this
        mainPollutantValue: data.aqi, // Using AQI as default, can be updated if webhook provides specific pollutant data
        temperature: data.weather.temp,
        humidity: data.weather.humidity,
        windSpeed: data.weather.wind
      };

      console.log('Processed city data:', cityData);
      return cityData;
    } catch (error) {
      console.error('Error fetching data from webhook:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setIsSearching(true);

      // Fetch air quality and weather data directly from webhook
      const cityData = await fetchCityDataFromWebhook(searchQuery);

      // Update state
      setCurrentCityData(cityData);
      setAverageAQI(cityData.aqi);

      // Save to localStorage
      localStorage.setItem('lastSearchedCity', JSON.stringify(cityData));
      setSearchQuery("");
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to fetch city data. Please try another city name.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get color based on AQI category
  const getAqiColor = (category: string) => {
    const found = aqiCategories.find(c => c.name === category);
    return found ? found.color : "#4ade80";
  };

  // Get color based on AQI value
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#c3f1cb';  // Good - Green
    if (aqi <= 100) return '#fef979'; // Moderate - Yellow
    if (aqi <= 150) return '#ffca59'; // Unhealthy for Sensitive Groups - Orange
    if (aqi <= 200) return '#ffca59'; // Unhealthy - Orange
    if (aqi <= 300) return '#fd6e6e'; // Very Unhealthy - Red
    return '#d597ff'; // Hazardous - Purple
  };

  // Get gradient background based on AQI value
  const getAQIGradient = (aqi: number): string => {
    if (aqi <= 50) return 'linear-gradient(180deg, #c3f1cb 0%, #a8e6b3 100%)';  // Good - Green gradient
    if (aqi <= 100) return 'linear-gradient(180deg, #fef979 0%, #f4ea00 100%)'; // Moderate - Yellow gradient
    if (aqi <= 150) return 'linear-gradient(180deg, #ffca59 0%, #ff9f1c 100%)'; // Unhealthy for Sensitive Groups - Orange gradient
    if (aqi <= 200) return 'linear-gradient(180deg, #ffca59 0%, #ff9f1c 100%)'; // Unhealthy - Orange gradient
    if (aqi <= 300) return 'linear-gradient(180deg, #fd6e6e 0%, #e63946 100%)'; // Very Unhealthy - Red gradient
    return 'linear-gradient(180deg, #d597ff 0%, #b565d8 100%)'; // Hazardous - Purple gradient
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="text-xl text-muted-foreground">
            Loading air quality data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFDFF' }}>
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      
      {/* Soft drop shadow below navbar */}
      <div 
  className="absolute w-full pointer-events-none" 
  style={{ 
    height: '24px',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 60%, transparent 100%)',
    zIndex: 50
  }}
/>

      
      {activeTab === "home" && (
        <>
          {/* Blue Background Section - Header + Map with extending ellipse */}
          <div style={{ backgroundColor: '#8DB2FF', position: 'relative', overflow: 'visible' }}>
            {/* Group 5 - Background Ellipses */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Ellipse 9 - Largest */}
              <div 
                style={{
                  position: 'absolute',
                  width: '776.92px',
                  height: '776.92px',
                  right: '-225px',
                  top: '-418px',
                  background: '#8DB2FF',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              />
              
              {/* Ellipse 10 */}
              <div 
                style={{
                  position: 'absolute',
                  width: '645.33px',
                  height: '645.33px',
                  right: '-159px',
                  top: '-353px',
                  background: '#9EBDFF',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              />
              
              {/* Ellipse 11 */}
              <div 
                style={{
                  position: 'absolute',
                  width: '502.87px',
                  height: '502.87px',
                  right: '-88px',
                  top: '-281px',
                  background: '#B2CBFF',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              />
              
              {/* Ellipse 12 */}
              <div 
                style={{
                  position: 'absolute',
                  width: '371.38px',
                  height: '371.38px',
                  right: '-23px',
                  top: '-216px',
                  background: '#C6D8FF',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              />
              
              {/* Ellipse 13 - Smallest */}
              <div 
                style={{
                  position: 'absolute',
                  width: '266.29px',
                  height: '266.29px',
                  right: '29px',
                  top: '-163px',
                  background: '#DAE6FF',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              />
            </div>

            {/* Large ellipse extending into section 2 - dengan clip-path untuk avoid scrollbar */}
            <div
              className="pointer-events-none"
              style={{
                position: 'absolute',
                left: '0',
                bottom: '-50%',
                width: '100%',
                height: '659px',
                background: '#8DB2FF',
                clipPath: 'ellipse(75% 100% at 50% 0%)',
                zIndex: 1
              }}
            />

            <main className="container mx-auto px-6 py-8 relative" style={{ zIndex: 10 }}>
              {/* Header Section */}
              <div className="mb-6 text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Air Quality Status</h1>
                <p className="text-lg text-white/90">
                  Air Quality Index (AQI) and PM2.5 pollution in {currentCityData.name}
                </p>
              </div>

          {/* Main Dashboard Layout */}
          <div className="relative overflow-hidden" style={{ marginTop: '45px' }}>

            
                        {/* Full-width Map Container - Rectangle 58 from Figma */}
                         {/* Outer wrapper: rounded + bg-white */}
             <div className="relative rounded-2xl bg-white max-w-[1440px] mx-auto" style={{
               zIndex: 10
             }}>
              {/* Inner wrapper: rounded + overflow-hidden untuk clip map */}
              <div className="rounded-2xl overflow-hidden h-[480px]">
                <MapContainer 
                  key={`${currentCityData.lat}-${currentCityData.lng}`}
                  center={[currentCityData.lat, currentCityData.lng]} 
                  zoom={12} 
                  style={{ 
                    height: '100%', 
                    width: '100%',
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: 'transparent'
                  }}
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                  />
                  <Marker position={[currentCityData.lat, currentCityData.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-bold mb-1">{currentCityData.name}</h3>
                        <p>AQI: {currentCityData.aqi}</p>
                        <p>Category: {currentCityData.category}</p>
                        <p>Main Pollutant: {currentCityData.mainPollutant}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Overlay Elements - Outside of MapContainer */}
            {/* Floating AQI Card - Top Right */}
            {/* Rectangle 9 - Yellow Gradient Background with Shadow */}
            <div className="absolute top-4 right-4" style={{ zIndex: 100, width: '341px', height: '370px' }}>
              <div 
                className="rounded-xl shadow-lg" 
                style={{
                  background: 'white',
                  border: `1px solid ${getAQIColor(currentCityData.aqi)}`,
                  borderRadius: '10px',
                  boxShadow: '4px 8px 10px rgba(0, 0, 0, 0.1019607843)',
                  width: '341px',
                  height: '370px',
                  padding: '0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Rectangle 5 - White Card Content */}
                <div 
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    width: '335px',
                    height: '311px',
                    padding: '16px',
                    position: 'relative',
                    flex: '0 0 311px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Group 3 - Location Header with Red Background */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '10px',
                      background: '#f1f2f4',
                      paddingRight: '12px',
                      paddingLeft: '0',
                      width: '293px',
                      height: '40px',
                      margin: '0 auto 16px auto',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '10px 0px 0px 10px',
                      background: '#fd6e6e',
                      padding: '8px 12px 8px 13px'
                    }}
                  >
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.8888 22.2862C11.4954 22.7867 12.128 23.2442 12.7757 23.6906C13.4248 23.2501 14.0543 22.7815 14.6626 22.2862C15.6767 21.4536 16.631 20.5508 17.5186 19.5844C19.5647 17.3471 21.7849 14.1038 21.7849 10.4631C21.7849 9.27998 21.5519 8.10845 21.0992 7.0154C20.6464 5.92235 19.9828 4.92918 19.1462 4.0926C18.3096 3.25602 17.3164 2.5924 16.2234 2.13964C15.1303 1.68689 13.9588 1.45386 12.7757 1.45386C11.5926 1.45386 10.4211 1.68689 9.32803 2.13964C8.23498 2.5924 7.24181 3.25602 6.40522 4.0926C5.56864 4.92918 4.90502 5.92235 4.45227 7.0154C3.99951 8.10845 3.76648 9.27998 3.76648 10.4631C3.76648 14.1038 5.98675 17.3461 8.03285 19.5844C8.92038 20.5511 9.8747 21.4532 10.8888 22.2862ZM12.7757 13.7164C11.9129 13.7164 11.0854 13.3737 10.4753 12.7635C9.86514 12.1534 9.52238 11.3259 9.52238 10.4631C9.52238 9.60025 9.86514 8.77275 10.4753 8.16263C11.0854 7.55251 11.9129 7.20975 12.7757 7.20975C13.6385 7.20975 14.466 7.55251 15.0762 8.16263C15.6863 8.77275 16.029 9.60025 16.029 10.4631C16.029 11.3259 15.6863 12.1534 15.0762 12.7635C14.466 13.3737 13.6385 13.7164 12.7757 13.7164Z" fill="white"/>
                    </svg>
                  </div>
                    <span
                      style={{
                        display: 'inline-block',
                        color: '#000',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '15px',
                        fontWeight: 600,
                        letterSpacing: '0px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '230px'
                      }}
                    >
                      {currentCityData.name}, {currentCityData.country}
                    </span>
                  </div>
                  
                  {/* Frame 6 - AQI Display */}
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '124px',
                      height: '107px',
                      margin: '0 auto 16px auto'
                    }}
                  >
                    <div 
                      style={{
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        textAlign: 'center',
                        letterSpacing: '0',
                        color: getAQIColor(currentCityData.aqi),
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '64px',
                        fontWeight: '600'
                      }}
                    >
                      {currentCityData.aqi}
                    </div>
                    <div 
                      style={{
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        margin: '-19px 0px 0px',
                        textAlign: 'center',
                        letterSpacing: '0',
                        color: getAQIColor(currentCityData.aqi),
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '20px',
                        fontWeight: '600'
                      }}
                    >
                      {currentCityData.category}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-gray-600 text-center mb-6">
                    {currentCityData.aqi <= 50 ? "Air quality is satisfactory" : 
                     currentCityData.aqi <= 100 ? "Air quality is acceptable for most people" :
                     currentCityData.aqi <= 200 ? "Air quality is unhealthy for everyone" :
                     currentCityData.aqi <= 300 ? "Air quality is very unhealthy for everyone" :
                     "Air quality is hazardous for everyone"}
                  </div>
                  
                  {/* Rectangle 8 - Gray Background Section */}
                  <div 
                    style={{
                      borderRadius: '10px',
                      background: '#f1f2f4',
                      width: '293px',
                      height: '58px',
                      padding: '12px',
                      margin: '0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center'
                    }}
                  >
                    <div 
                      style={{
                        textAlign: 'left',
                        letterSpacing: '0',
                        color: '#3d3d3d',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}
                    >
                      Main Pollutant
                    </div>
                    <div 
                      style={{
                        lineHeight: '20px',
                        textAlign: 'left',
                        letterSpacing: '0',
                        color: '#3d3d3d',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      {currentCityData.mainPollutant}
                    </div>
                  </div>
                </div>
                
                {/* Weather Details - Footer with Gradient */}
                <div 
                  style={{
                    background: getAQIGradient(currentCityData.aqi),
                    borderRadius: '0 0 10px 10px',
                    padding: '12px 16px',
                    height: '59px',
                    display: 'flex',
                    alignItems: 'center',
                    flex: '1'
                  }}
                >
                  <div className="flex items-center justify-center w-full px-4" style={{ color: '#3D3D3D', fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex items-center justify-between w-full max-w-xs">
                      <div className="flex items-center gap-2">
                        <img src="/.figma/image/meths6m4-osomnqk.svg" className="h-4 w-4" />
                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{currentCityData.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="/.figma/image/meths6m4-ygz2nyn.svg" className="h-4 w-4" />
                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{currentCityData.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="/.figma/image/meths6m4-dte37nt.svg" className="h-4 w-4" />
                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0', wordSpacing: 'normal', fontFeatureSettings: 'normal' }}>{currentCityData.windSpeed} m/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

            
            {/* AQI Legend - Bottom Center - Rectangle 11 & Frame 18 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2" style={{ zIndex: 100 }}>
              {/* Rectangle 11 - White container with yellow border */}
              <div 
                style={{
                  border: '1px solid #fef979',
                  borderRadius: '7px',
                  background: '#ffffff',
                  width: '413px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 12px'
                }}
              >
                {/* Frame 18 - Category badges container */}
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    columnGap: '10px',
                    width: '382px',
                    height: '22px'
                  }}
                >
                  {/* Good */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      flexShrink: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: '8px',
                      borderRadius: '3px',
                      background: '#c3f1cb',
                      padding: '3px 7px'
                    }}
                  >
                    <span 
                      style={{
                        lineHeight: '15px',
                        letterSpacing: '0',
                        color: '#ffffff',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      Good
                    </span>
                  </div>
                  
                  {/* Moderate */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      flexShrink: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: '8px',
                      borderRadius: '3px',
                      background: '#fef979',
                      padding: '3px 7px'
                    }}
                  >
                    <span 
                      style={{
                        lineHeight: '15px',
                        letterSpacing: '0',
                        color: '#ffffff',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      Moderate
                    </span>
                  </div>
                  
                  {/* Unhealthy */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      flexShrink: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: '8px',
                      borderRadius: '3px',
                      background: '#ffca59',
                      padding: '3px 7px'
                    }}
                  >
                    <span 
                      style={{
                        lineHeight: '15px',
                        letterSpacing: '0',
                        color: '#ffffff',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      Unhealthy
                    </span>
                  </div>
                  
                  {/* Very Unhealthy */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      flexShrink: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: '8px',
                      borderRadius: '3px',
                      background: '#fd6e6e',
                      padding: '3px 7px'
                    }}
                  >
                    <span 
                      style={{
                        lineHeight: '15px',
                        letterSpacing: '0',
                        color: '#ffffff',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      Very Unhealthy
                    </span>
                  </div>
                  
                  {/* Hazardous */}
                  <div 
                    style={{
                      display: 'inline-flex',
                      flexShrink: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: '8px',
                      borderRadius: '3px',
                      background: '#d597ff',
                      padding: '3px 7px'
                    }}
                  >
                    <span 
                      style={{
                        lineHeight: '15px',
                        letterSpacing: '0',
                        color: '#ffffff',
                        fontFamily: 'Poppins, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      Hazardous
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

            </main>
          </div>

          {/* Average Air Quality Section - transparent background, content above ellipse */}
          <section className="-mt-8 py-8 relative" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center text-white relative flex flex-col items-center" style={{ zIndex: 10 }}>
                <h2 className="text-3xl font-bold mb-8">Average Air Quality in Indonesia</h2>
                {/* Horizontal Layout: PM2.5 Circle, AQI Text, Progress Bar */}
                <div className="flex items-center justify-center max-w-7xl mx-auto px-12 w-full gap-12 ml-24">
                 {/* PM2.5 Circle */}
                  <div className="flex-shrink-0">
                    <div className="relative" style={{ width: '192px', height: '192px' }}>
                    {/* Rectangle 63 - Outermost circle */}
                    <div 
                      className="absolute rounded-full"
                      style={{
                        width: '192px',
                        height: '192px',
                        left: '0px',
                        top: '0px',
                        background: 'linear-gradient(180deg, #FEF979 0%, #F4EC22 100%)',
                        opacity: 0.19,
                        borderRadius: '100px'
                      }}
                    ></div>
                    {/* Rectangle 65 - Middle circle */}
                    <div 
                      className="absolute rounded-full"
                      style={{
                        width: '166px',
                        height: '166px',
                        left: '13px',
                        top: '13px',
                        background: 'linear-gradient(180deg, #FEF979 0%, #F4EC22 100%)',
                        opacity: 0.36,
                        borderRadius: '100px'
                      }}
                    ></div>
                    {/* Rectangle 64 - Inner circle */}
                    <div 
                      className="absolute rounded-full"
                      style={{
                        width: '144px',
                        height: '144px',
                        left: '24px',
                        top: '24px',
                        background: 'linear-gradient(180deg, #FEF979 0%, #F4EC22 100%)',
                        borderRadius: '100px'
                      }}
                    ></div>
                    {/* PM 2.5 Text */}
                    <div 
                      className="absolute"
                      style={{
                        width: '46px',
                        height: '21px',
                        left: '72px',
                        top: '45px',
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        fontSize: '14px',
                        lineHeight: '21px',
                        color: '#3D3D3D'
                      }}
                    >
                      PM 2.5
                    </div>
                    {/* 35,54 Value */}
                    <div 
                      className="absolute"
                      style={{
                        width: '90px',
                        height: '48px',
                        left: '51px',
                        top: '77px',
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        fontSize: '32px',
                        lineHeight: '48px',
                        color: '#3D3D3D'
                      }}
                    >
                      35,54
                    </div>
                    {/* µm/ m³ Unit */}
                    <div 
                      className="absolute"
                      style={{
                        width: '53px',
                        height: '21px',
                        left: '69px',
                        top: '117px',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '21px',
                        color: '#3D3D3D'
                      }}
                    >
                      µm/ m³
                    </div>
                  </div>
                </div>
                {/* Center - AQI Text */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center text-center">
                  <div className="text-8xl font-bold mb-4">101</div>
                  <div className="text-2xl font-semibold mb-2">AQI⁺ Index</div>
                  <div className="text-lg opacity-90">Stable from Yesterday</div>
                </div>
                {/* Right - Progress Bar */}
                  <div className="flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="text-sm opacity-90 mb-3">Based on All Monitoring Stations</div>
                    <div 
                      className="relative transition-all duration-500"
                      style={{
                        width: '352.45px',
                        height: '43px',
                        background: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '7.67857px'
                      }}
                    >
                      {/* Rectangle 60 - Background Track */}
                      <div 
                        className="absolute"
                        style={{
                          width: '323.27px',
                          height: '9.98px',
                          left: '14.59px',
                          top: '16.89px',
                          background: '#F1F1F1',
                          borderRadius: '76.7857px'
                        }}
                      >
                        {/* Rectangle 61 - Progress Fill */}
                        <div 
                          className="transition-all duration-500" 
                          style={{ 
                            width: `${Math.min((averageAQI / 200) * 323.27, 323.27)}px`,
                            height: '9.98px',
                            background: '#3D3D3D',
                            borderRadius: '76.7857px'
                          }} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mt-2 opacity-75" style={{ width: '352.45px' }}>
                      <span>0</span>
                      <span>200+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Air Pollutants Section - sesuai referensi Figma */}
          <section className="relative pt-36 pb-16" style={{ backgroundColor: '#FAFDFF' }}>
            <div className="container mx-auto px-6">
              {/* Frame 26 - Air Pollutants Container */}
              <div className="relative mx-auto flex items-center justify-center" style={{ maxWidth: '1280px', minHeight: '382px' }}>
                {/* Rectangle 12 - Background hijau */}
                <div 
                  className="absolute inset-0 rounded-[50px]"
                  style={{
                    background: '#ECFFBD',
                    width: '100%',
                    height: '382px'
                  }}
                />
                
                {/* Content */}
                <div className="relative px-12 py-4 w-full flex flex-col justify-center">
                  {/* Header */}
                  <div className="mb-6 text-left">
                    <h2 
                      className="mb-0"
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        fontSize: '32px',
                        lineHeight: '48px',
                        color: '#3D3D3D'
                      }}
                    >
                      Air Pollutants
                    </h2>
                    <p 
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '30px',
                        color: '#3D3D3D'
                      }}
                    >
                      Current pollutant levels in your area
                    </p>
                </div>
                
                  {/* Grid 6 kolom pollutants - centered */}
                  <div className="grid grid-cols-6 gap-8 justify-items-center max-w-6xl mx-auto">
                    {/* PM 2.5 */}
                    <div className="bg-white rounded-[10px] p-4 relative flex flex-col items-center justify-center w-full" style={{ height: '180px', maxWidth: '170px' }}>
                      <div className="absolute w-[15px] h-[15px] rounded-full" style={{ background: '#FD6E6E', left: '14px', top: '13px' }} />
                      <div 
                        className="text-center mb-3"
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '30px',
                          color: '#3D3D3D'
                        }}
                      >
                        PM 2.5
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div 
                          className="text-center"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '64px',
                            lineHeight: '96px',
                            color: '#3D3D3D'
                          }}
                        >
                          80
                        </div>
                        <div 
                          className="text-center mt-1"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '22px',
                            color: '#3D3D3D'
                          }}
                        >
                          μm/ m<sup style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 500, color: '#3D3D3D' }}>3</sup>
                        </div>
                      </div>
                    </div>
                    
                    {/* PM10 */}
                    <div className="bg-white rounded-[10px] p-4 relative flex flex-col items-center justify-center w-full" style={{ height: '180px', maxWidth: '170px' }}>
                      <div className="absolute w-[15px] h-[15px] rounded-full" style={{ background: '#C3F1CB', left: '14px', top: '13px' }} />
                      <div 
                        className="text-center mb-3"
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '30px',
                          color: '#3D3D3D'
                        }}
                      >
                        PM10
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div 
                          className="text-center"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '64px',
                            lineHeight: '96px',
                            color: '#3D3D3D'
                          }}
                        >
                          52
                        </div>
                        <div 
                          className="text-center mt-1"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '22px',
                            color: '#3D3D3D'
                          }}
                        >
                          μm/ m<sup style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 500, color: '#3D3D3D' }}>3</sup>
                        </div>
                      </div>
                    </div>
                    
                    {/* O₃ */}
                    <div className="bg-white rounded-[10px] p-4 relative flex flex-col items-center justify-center w-full" style={{ height: '180px', maxWidth: '170px' }}>
                      <div className="absolute w-[15px] h-[15px] rounded-full" style={{ background: '#C3F1CB', left: '14px', top: '13px' }} />
                      <div 
                        className="text-center mb-3"
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '30px',
                          color: '#3D3D3D'
                        }}
                      >
                        O<sub style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#3D3D3D' }}>3</sub>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div 
                          className="text-center"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '64px',
                            lineHeight: '96px',
                            color: '#3D3D3D'
                          }}
                        >
                          37.2
                        </div>
                        <div 
                          className="text-center mt-1"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '22px',
                            color: '#3D3D3D'
                          }}
                        >
                          μm/ m<sup style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 500, color: '#3D3D3D' }}>3</sup>
                        </div>
                      </div>
                    </div>
                    
                    {/* NO₂ */}
                    <div className="bg-white rounded-[10px] p-4 relative flex flex-col items-center justify-center w-full" style={{ height: '180px', maxWidth: '170px' }}>
                      <div className="absolute w-[15px] h-[15px] rounded-full" style={{ background: '#C3F1CB', left: '14px', top: '13px' }} />
                      <div 
                        className="text-center mb-3"
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '30px',
                          color: '#3D3D3D'
                        }}
                      >
                        NO<sub style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#3D3D3D' }}>2</sub>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div 
                          className="text-center"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '64px',
                            lineHeight: '96px',
                            color: '#3D3D3D'
                          }}
                        >
                          7.6
                        </div>
                        <div 
                          className="text-center mt-1"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '22px',
                            color: '#3D3D3D'
                          }}
                        >
                          μm/ m<sup style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 500, color: '#3D3D3D' }}>3</sup>
                        </div>
                      </div>
                    </div>
                    
                    {/* SO₂ */}
                    <div className="bg-white rounded-[10px] p-4 relative flex flex-col items-center justify-center w-full" style={{ height: '180px', maxWidth: '170px' }}>
                      <div className="absolute w-[15px] h-[15px] rounded-full" style={{ background: '#C3F1CB', left: '14px', top: '13px' }} />
                      <div 
                        className="text-center mb-3"
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '30px',
                          color: '#3D3D3D'
                        }}
                      >
                        SO<sub style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#3D3D3D' }}>2</sub>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div 
                          className="text-center"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '64px',
                            lineHeight: '96px',
                            color: '#3D3D3D'
                          }}
                        >
                          13
                        </div>
                        <div 
                          className="text-center mt-1"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '22px',
                            color: '#3D3D3D'
                          }}
                        >
                          μm/ m<sup style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 500, color: '#3D3D3D' }}>3</sup>
                        </div>
                      </div>
                    </div>
                    
                    {/* CO */}
                    <div className="bg-white rounded-[10px] p-4 relative flex flex-col items-center justify-center w-full" style={{ height: '180px', maxWidth: '170px' }}>
                      <div className="absolute w-[15px] h-[15px] rounded-full" style={{ background: '#C3F1CB', left: '14px', top: '13px' }} />
                      <div 
                        className="text-center mb-3"
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '30px',
                          color: '#3D3D3D'
                        }}
                      >
                        CO
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div 
                          className="text-center"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '55px',
                            lineHeight: '82px',
                            color: '#3D3D3D'
                          }}
                        >
                          795.3
                        </div>
                        <div 
                          className="text-center mt-1"
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '15px',
                            lineHeight: '22px',
                            color: '#3D3D3D'
                          }}
                        >
                          μm/ m<sup style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 500, color: '#3D3D3D' }}>3</sup>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Forecasts Section - sesuai referensi Figma */}
          <section id="forecast-section" className="py-8" style={{ backgroundColor: '#FAFDFF' }}>
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* Hourly Forecast - Rectangle 18 */}
                <div className="relative">
                  <div 
                    className="bg-white rounded-[10px] p-6"
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      height: '442px'
                    }}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <h3 
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '24px',
                          lineHeight: '36px',
                          color: '#3D3D3D'
                        }}
                      >
                        Hourly Forecast
                      </h3>
                      <p 
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '15px',
                          lineHeight: '22px',
                          color: '#3D3D3D'
                        }}
                      >
                        {currentCityData.name} Air Quality Index (AQI⁺) Forecast
                      </p>
                    </div>
                    
                    {/* Hourly Items */}
                    <div className="flex gap-3 overflow-x-auto">
                      {/* Now */}
                      <div className="flex-shrink-0 relative" style={{ width: '86px', height: '283px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative p-3 flex flex-col items-center h-full">
                                                    <div 
                            className="text-center mb-2"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000'
                            }}
                          >
                            Now
                          </div>
                          <div 
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2"
                            style={{ background: '#FFCA59' }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="flex flex-col items-center justify-around flex-1 mt-0">
                            {/* Temperature */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="26" height="26" />
                              <span 
                                className="font-inter"
                                style={{
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '15px',
                                  lineHeight: '18px',
                                  color: '#3D3D3D'
                                }}
                              >
                                29°C
                              </span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="17.5" height="17.5" />
                              <span 
                                className="font-inter"
                                style={{
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '15px',
                                  lineHeight: '18px',
                                  color: '#3D3D3D'
                                }}
                              >
                                56%
                              </span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="20" height="18.75" />
                              <span 
                                className="font-inter"
                                style={{
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '15px',
                                  lineHeight: '18px',
                                  color: '#3D3D3D'
                                }}
                              >
                                3.5 m/s
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 00.00 */}
                      <div className="flex-shrink-0 relative" style={{ width: '86px', height: '283px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative p-3 flex flex-col items-center h-full">
                          <div 
                            className="text-center mb-2"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000'
                            }}
                          >
                            00.00
                          </div>
                          <div 
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2"
                            style={{ background: '#FFCA59' }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="flex flex-col items-center justify-around flex-1 mt-0">
                            {/* Temperature */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="26" height="26" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="17.5" height="17.5" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="20" height="18.75" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 01.00 */}
                      <div className="flex-shrink-0 relative" style={{ width: '86px', height: '283px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative p-3 flex flex-col items-center h-full">
                          <div 
                            className="text-center mb-2"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000'
                            }}
                          >
                            01.00
                          </div>
                          <div 
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2"
                            style={{ background: '#FFCA59' }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="flex flex-col items-center justify-around flex-1 mt-0">
                            {/* Temperature */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="26" height="26" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="17.5" height="17.5" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="20" height="18.75" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 02.00 */}
                      <div className="flex-shrink-0 relative" style={{ width: '86px', height: '283px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative p-3 flex flex-col items-center h-full">
                          <div 
                            className="text-center mb-2"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000'
                            }}
                          >
                            02.00
                          </div>
                          <div 
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2"
                            style={{ background: '#FFCA59' }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="flex flex-col items-center justify-around flex-1 mt-0">
                            {/* Temperature */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="26" height="26" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="17.5" height="17.5" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="20" height="18.75" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 03.00 */}
                      <div className="flex-shrink-0 relative" style={{ width: '86px', height: '283px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative p-3 flex flex-col items-center h-full">
                          <div 
                            className="text-center mb-2"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000'
                            }}
                          >
                            03.00
                          </div>
                          <div 
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2"
                            style={{ background: '#FFCA59' }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="flex flex-col items-center justify-around flex-1 mt-0">
                            {/* Temperature */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="26" height="26" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="17.5" height="17.5" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="20" height="18.75" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 04.00 */}
                      <div className="flex-shrink-0 relative" style={{ width: '86px', height: '283px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative p-3 flex flex-col items-center h-full">
                          <div 
                            className="text-center mb-2"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000'
                            }}
                          >
                            04.00
                          </div>
                          <div 
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2"
                            style={{ background: '#FFCA59' }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '22px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="flex flex-col items-center justify-around flex-1 mt-0">
                            {/* Temperature */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="26" height="26" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="17.5" height="17.5" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex flex-col items-center justify-center gap-1">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="20" height="18.75" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '15px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Daily Forecast - Rectangle 67 */}
                <div className="relative">
                  <div 
                    className="bg-white rounded-[10px] p-6"
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      height: '442px'
                    }}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <h3 
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '24px',
                          lineHeight: '36px',
                          color: '#3D3D3D'
                        }}
                      >
                        Daily Forecast
                      </h3>
                      <p 
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '15px',
                          lineHeight: '22px',
                          color: '#3D3D3D'
                        }}
                      >
                        {currentCityData.name} Air Quality Index (AQI⁺) Forecast
                      </p>
                    </div>
                    
                    {/* Daily Items */}
                    <div className="space-y-4">
                      {/* Day 1 */}
                      <div className="relative" style={{ height: '76px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative flex items-center h-full px-4">
                          <div 
                            className="text-center"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000',
                              width: '40px'
                            }}
                          >
                            Min
                          </div>
                          <div 
                            className="ml-4 flex items-center justify-center rounded-[10px]"
                            style={{ 
                              background: '#FFCA59',
                              width: '80px',
                              height: '43px'
                            }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '20px',
                                lineHeight: '30px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="ml-10 flex items-center gap-10">
                            {/* Temperature */}
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="28" height="28" />
                              <span 
                                className="font-inter"
                                style={{
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '21.3347px',
                                  lineHeight: '18px',
                                  color: '#3D3D3D'
                                }}
                              >
                                29°C
                              </span>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="24.89" height="24.89" />
                              <span 
                                className="font-inter"
                                style={{
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '21.3347px',
                                  lineHeight: '18px',
                                  color: '#3D3D3D'
                                }}
                              >
                                56%
                              </span>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="28.45" height="26.67" />
                              <span 
                                className="font-inter"
                                style={{
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '21.3347px',
                                  lineHeight: '18px',
                                  color: '#3D3D3D'
                                }}
                              >
                                3.5 m/s
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Day 2 */}
                      <div className="relative" style={{ height: '76px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative flex items-center h-full px-4">
                          <div 
                            className="text-center"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000',
                              width: '40px'
                            }}
                          >
                            Min
                          </div>
                          <div 
                            className="ml-4 flex items-center justify-center rounded-[10px]"
                            style={{ 
                              background: '#FFCA59',
                              width: '80px',
                              height: '43px'
                            }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '20px',
                                lineHeight: '30px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="ml-10 flex items-center gap-10">
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="28" height="28" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '21.3347px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="24.89" height="24.89" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '21.3347px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="28.45" height="26.67" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '21.3347px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Day 3 */}
                      <div className="relative" style={{ height: '76px' }}>
                        <div 
                          className="absolute inset-0 rounded-[10px]"
                          style={{ background: 'rgba(244, 255, 141, 0.2)' }}
                        />
                        <div className="relative flex items-center h-full px-4">
                          <div 
                            className="text-center"
                            style={{
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: '#000000',
                              width: '40px'
                            }}
                          >
                            Min
                          </div>
                          <div 
                            className="ml-4 flex items-center justify-center rounded-[10px]"
                            style={{ 
                              background: '#FFCA59',
                              width: '80px',
                              height: '43px'
                            }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                fontSize: '20px',
                                lineHeight: '30px',
                                color: '#FFFFFF'
                              }}
                            >
                              135
                            </span>
                          </div>
                          
                          {/* Weather Details */}
                          <div className="ml-10 flex items-center gap-10">
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-osomnqk.svg" width="28" height="28" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '21.3347px', lineHeight: '18px', color: '#3D3D3D' }}>29°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-ygz2nyn.svg" width="24.89" height="24.89" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '21.3347px', lineHeight: '18px', color: '#3D3D3D' }}>56%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src="/.figma/image/meths6m4-dte37nt.svg" width="28.45" height="26.67" />
                              <span className="font-inter" style={{ fontWeight: 400, fontSize: '21.3347px', lineHeight: '18px', color: '#3D3D3D' }}>3.5 m/s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              

            </div>
          </section>
        </>
      )}

      {/* History Section */}
      <section id="history-section" className="relative mt-8" style={{ backgroundColor: '#ECFFBD', height: '604px' }}>
        <div className="absolute" style={{ left: '97px', top: '53px' }}>
          <h2 className="text-3xl font-bold" style={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '48px',
            color: '#3D3D3D'
          }}>
            History
          </h2>
          <p className="mt-0" style={{
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '30px',
            color: '#3D3D3D',
            whiteSpace: 'nowrap'
          }}>
            Air Quality Chart for {currentCityData.name}
          </p>
        </div>
        
        {/* Legend */}
        <div className="absolute" style={{
          left: '930px',
          top: '40px',
          width: '339.9px',
          height: '33px',
          background: '#FFFFFF',
          border: '0.55px solid #FEF979',
          borderRadius: '5.5px',
          boxSizing: 'border-box'
        }}>
          <div className="flex items-center gap-2" style={{
            position: 'absolute',
            left: '12.65px',
            top: '7.15px',
            width: '315.5px',
            height: '17.5px'
          }}>
            {/* Good */}
            <div className="flex justify-center items-center" style={{
              padding: '2.75px 6.05px',
              width: '35.1px',
              height: '17.5px',
              background: '#C3F1CB',
              borderRadius: '2.75px'
            }}>
              <span style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '8.25px',
                lineHeight: '12px',
                color: '#FFFFFF'
              }}>Good</span>
            </div>
            
            {/* Moderate */}
            <div className="flex justify-center items-center" style={{
              padding: '2.75px 6.05px',
              width: '54.1px',
              height: '17.5px',
              background: '#FEF979',
              borderRadius: '2.75px'
            }}>
              <span style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '8.25px',
                lineHeight: '12px',
                color: '#FFFFFF'
              }}>Moderate</span>
            </div>
            
            {/* Unhealthy */}
            <div className="flex justify-center items-center" style={{
              padding: '2.75px 6.05px',
              width: '57.1px',
              height: '17.5px',
              background: '#FFCA59',
              borderRadius: '2.75px'
            }}>
              <span style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '8.25px',
                lineHeight: '12px',
                color: '#FFFFFF'
              }}>Unhealthy</span>
            </div>
            
            {/* Very Unhealthy */}
            <div className="flex justify-center items-center" style={{
              padding: '2.75px 6.05px',
              width: '78.1px',
              height: '17.5px',
              background: '#FD6E6E',
              borderRadius: '2.75px'
            }}>
              <span style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '8.25px',
                lineHeight: '12px',
                color: '#FFFFFF'
              }}>Very Unhealthy</span>
            </div>
            
            {/* Hazardous */}
            <div className="flex justify-center items-center" style={{
              padding: '2.75px 6.05px',
              width: '58.1px',
              height: '17.5px',
              background: '#D597FF',
              borderRadius: '2.75px'
            }}>
              <span style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '8.25px',
                lineHeight: '12px',
                color: '#FFFFFF'
              }}>Hazardous</span>
            </div>
          </div>
        </div>
             </section>

       {/* Footer Section - Rectangle 118 */}
       <footer 
         className="relative w-full"
         style={{ 
           backgroundColor: '#FFFFFF',
           height: '120px',
           boxShadow: '0px -3px 15px rgba(0, 0, 0, 0.07)'
         }}
       >
         <div className="relative w-full h-full flex items-center justify-between px-8">
           {/* Logo Section - Rectangle 120 */}
           <div 
             style={{
               width: '280px',
               height: '52px',
               background: '#FFFFFF',
               border: '1px solid #3D3D3D',
               borderRadius: '10px',
               boxSizing: 'border-box',
               display: 'flex',
               alignItems: 'center',
               padding: '0 27px'
             }}
           >
             {/* Frame 2 - Logo Content */}
             <div 
               style={{
                 display: 'flex',
                 flexDirection: 'row',
                 alignItems: 'center',
                 gap: '17.22px',
                 width: '220.75px',
                 height: '54.53px'
               }}
             >
               {/* Cloud Icon - ph:cloud-fill */}
               <div 
                 style={{
                   width: '54.53px',
                   height: '54.53px',
                   flex: 'none',
                   order: 0,
                   flexGrow: 0,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}
               >
                 <svg width="54.53" height="54.53" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path 
                     d="M35.6384 8.90625C31.9972 8.90682 28.4281 9.92081 25.3306 11.8347C22.2331 13.7486 19.7293 16.4868 18.0997 19.7429C16.7455 22.4424 16.0373 25.4198 16.0312 28.4399C16.0382 28.8988 15.8717 29.3434 15.565 29.6848C15.2582 30.0262 14.8339 30.2392 14.3769 30.2812C14.1325 30.2987 13.8872 30.2656 13.6562 30.1839C13.4252 30.1022 13.2136 29.9738 13.0345 29.8066C12.8554 29.6394 12.7127 29.4371 12.6154 29.2123C12.518 28.9875 12.4681 28.745 12.4688 28.5C12.467 26.0086 12.8685 23.5333 13.6577 21.1702C13.7097 21.0186 13.7199 20.8559 13.6872 20.6991C13.6545 20.5423 13.58 20.3972 13.4718 20.2791C13.3635 20.161 13.2254 20.0743 13.072 20.0282C12.9186 19.982 12.7556 19.9781 12.6001 20.0168C9.51371 20.7861 6.77279 22.5645 4.81267 25.0696C2.85255 27.5747 1.78559 30.6629 1.78125 33.8438C1.78125 41.679 8.40527 48.0938 16.2539 48.0938H35.625C38.2625 48.0909 40.8723 47.5562 43.2984 46.5215C45.7244 45.4868 47.9169 43.9734 49.7446 42.0719C51.5723 40.1704 52.9978 37.9198 53.9357 35.4547C54.8736 32.9896 55.3047 30.3607 55.2032 27.7252C54.7979 17.2648 46.1054 8.90625 35.6384 8.90625Z" 
                     fill="#8DB2FF"
                   />
                 </svg>
               </div>

               {/* Air Quality Text */}
               <div 
                 style={{
                   width: '149px',
                   height: '40px',
                   fontFamily: 'Poppins',
                   fontStyle: 'normal',
                   fontWeight: 800,
                   fontSize: '26.7879px',
                   lineHeight: '40px',
                   color: '#3D3D3D',
                   flex: 'none',
                   order: 1,
                   flexGrow: 0
                 }}
               >
                 Air Quality
               </div>
             </div>
           </div>

           {/* Copyright Text */}
           <div 
             style={{
               fontFamily: 'Poppins',
               fontStyle: 'normal',
               fontWeight: 600,
               fontSize: '20px',
               lineHeight: '30px',
               color: '#3D3D3D'
             }}
           >
             © 2025 Air Quality Monitor. All rights reserved.
           </div>
         </div>
       </footer>

      {activeTab === "cast" && (
        <main className="container mx-auto px-6 py-8" style={{ backgroundColor: '#FAFDFF' }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Air Quality Cast</h2>
            <p className="text-muted-foreground mb-8">
              Advanced air quality predictions and modeling
            </p>
            <div className="grid grid-cols-1 gap-6">
              <ForecastWidget title="Extended Forecast" type="hourly" data={airQualityAPI.generateForecastData("hourly")} />
              <HistoricalChart data={airQualityAPI.generateHistoricalData()} />
            </div>
          </div>
        </main>
      )}

      {activeTab === "forecast" && (
          <main className="container mx-auto px-6 py-8" style={{ backgroundColor: '#FAFDFF' }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Extended Forecast</h2>
            <p className="text-muted-foreground mb-8">
              Detailed air quality predictions
            </p>
            <div className="grid grid-cols-1 gap-6">
              <ForecastWidget title="Next 24 Hours" type="hourly" data={airQualityAPI.generateForecastData("hourly")} />
              <ForecastWidget title="Next 7 Days" type="daily" data={airQualityAPI.generateForecastData("daily")} />
            </div>
          </div>
        </main>
      )}

      {activeTab === "graph" && (
          <main className="container mx-auto px-6 py-8" style={{ backgroundColor: '#FAFDFF' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Historical Data</h2>
            <p className="text-muted-foreground">
              Air quality trends and analysis
            </p>
          </div>
          <HistoricalChart data={airQualityAPI.generateHistoricalData()} />
        </main>
      )}


    </div>
  );
};

export default Index;