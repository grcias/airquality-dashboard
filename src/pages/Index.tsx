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
import { Clock, Calendar, Search, Thermometer, Droplets, Wind } from "lucide-react";
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
    windSpeed: 3.5
  });
  const [averageAQI, setAverageAQI] = useState(0);
  const [pollutionUnits, setPollutionUnits] = useState({
    pm25: 0,
    pm10: 0,
    o3: 0,
    no2: 0
  });
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-background">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      
      {activeTab === "home" && (
        <main className="container mx-auto px-6 py-8">

          {/* Header Section */}
          <div className="mb-6 text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">Air Quality Status</h1>
            <p className="text-lg text-muted-foreground">
              Air Quality Index (AQI) and PM2.5 pollution in {currentCityData.name}
            </p>
          </div>

          {/* Main Dashboard Layout */}
          <div className="relative">
            {/* Full-width Map Container */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative" style={{ height: '500px' }}>
              <MapContainer 
                key={`${currentCityData.lat}-${currentCityData.lng}`}
                center={[currentCityData.lat, currentCityData.lng]} 
                zoom={12} 
                style={{ 
                  height: '100%', 
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
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

            {/* Overlay Elements - Outside of MapContainer */}
            {/* Floating AQI Card - Top Right */}
            <div className="absolute top-4 right-4 w-80" style={{ zIndex: 1000 }}>
              <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/95">
                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">📍</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{currentCityData.name}, {currentCityData.country}</span>
                </div>
                
                {/* AQI Number */}
                <div className="mb-2">
                  <div 
                    className="text-5xl font-bold mb-1" 
                    style={{ color: getAqiColor(currentCityData.category) }}
                  >
                    {currentCityData.aqi}
                  </div>
                  <div 
                    className="text-lg font-semibold" 
                    style={{ color: getAqiColor(currentCityData.category) }}
                  >
                    {currentCityData.category}
                  </div>
                </div>
                
                {/* Description */}
                <div className="text-sm text-gray-600 mb-4">
                  {currentCityData.aqi <= 50 ? "Air quality is satisfactory" : 
                   currentCityData.aqi <= 100 ? "Air quality is acceptable for most people" :
                   currentCityData.aqi <= 200 ? "Air quality is unhealthy for everyone" :
                   currentCityData.aqi <= 300 ? "Air quality is very unhealthy for everyone" :
                   "Air quality is hazardous for everyone"}
                </div>
                
                {/* Main Pollutant */}
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Main Pollutant</div>
                  <div className="text-sm font-semibold text-gray-700">{currentCityData.mainPollutant}</div>
                </div>
                
                {/* Weather Details */}
                <div className="flex items-center justify-between bg-yellow-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">{currentCityData.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{currentCityData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{currentCityData.windSpeed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AQI Legend - Bottom Left */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2" style={{ zIndex: 1000 }}>
              {aqiCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-white/20"
                >
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-200" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs font-medium text-gray-700">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid - Air Pollutants and Forecasts */}
          <div className="mt-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left - Air Pollutants */}
              <div className="xl:col-span-1">
                <PollutionUnits data={pollutionUnits} />
              </div>
              
              {/* Right - Forecasts - Stacked vertically with equal heights */}
              <div className="xl:col-span-2 flex flex-col h-full">
                <div className="flex-1 mb-3">
                  <ForecastWidget 
                    title="Hourly Forecast" 
                    type="hourly" 
                    data={airQualityAPI.generateForecastData("hourly")} 
                    icon={<Clock className="h-5 w-5" />} 
                  />
                </div>
                <div className="flex-1">
                  <ForecastWidget 
                    title="Daily Forecast" 
                    type="daily" 
                    data={airQualityAPI.generateForecastData("daily")} 
                    icon={<Calendar className="h-5 w-5" />} 
                  />
                </div>
              </div>
            </div>
            
            {/* Historical Chart */}
            <div className="mt-8">
              <HistoricalChart data={airQualityAPI.generateHistoricalData()} />
            </div>
          </div>
        </main>
      )}

      {activeTab === "cast" && (
        <main className="container mx-auto px-6 py-8">
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
        <main className="container mx-auto px-6 py-8">
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
        <main className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Historical Data</h2>
            <p className="text-muted-foreground">
              Air quality trends and analysis
            </p>
          </div>
          <HistoricalChart data={airQualityAPI.generateHistoricalData()} />
        </main>
      )}

      {activeTab === "stations" && (
        <main className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Monitoring Stations</h2>
            <p className="text-muted-foreground">
              Real-time data from air quality monitoring networks
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-xl shadow-lg overflow-hidden">
              <div className="h-[450px] relative">
                <MapContainer 
                  center={[currentCityData.lat, currentCityData.lng]} 
                  zoom={10} 
                  style={{
                    height: '100%',
                    width: '100%'
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
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;