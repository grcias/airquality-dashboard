import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletFix.css';
import L from 'leaflet';
import { Thermometer, Droplets, Wind } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock data for air quality stations
const mockStations = [
  {
    placeName: "Jakarta Central",
    aqi: 85,
    category: "Moderate",
    mainPollutant: "PM2.5",
    mainPollutantValue: 53,
    lat: -6.223099,
    lng: 106.791597,
    temperature: 29,
    humidity: 56,
    windSpeed: 3.5
  },
  {
    placeName: "Jakarta North",
    aqi: 95,
    category: "Moderate",
    mainPollutant: "PM10",
    mainPollutantValue: 62,
    lat: -6.213099,
    lng: 106.781597,
    temperature: 30,
    humidity: 54,
    windSpeed: 4.2
  },
  {
    placeName: "Jakarta South",
    aqi: 110,
    category: "Unhealthy for Sensitive Groups",
    mainPollutant: "O3",
    mainPollutantValue: 78,
    lat: -6.233099,
    lng: 106.801597,
    temperature: 31,
    humidity: 52,
    windSpeed: 3.8
  },
  {
    placeName: "Jakarta East",
    aqi: 75,
    category: "Moderate",
    mainPollutant: "NO2",
    mainPollutantValue: 45,
    lat: -6.223099,
    lng: 106.811597,
    temperature: 28,
    humidity: 58,
    windSpeed: 2.9
  },
  {
    placeName: "Jakarta West",
    aqi: 65,
    category: "Good",
    mainPollutant: "PM2.5",
    mainPollutantValue: 38,
    lat: -6.223099,
    lng: 106.771597,
    temperature: 27,
    humidity: 60,
    windSpeed: 3.2
  }
];

// AQI Categories and colors
const aqiCategories = [
  { name: "Good", color: "#4ade80", range: "0-50" },
  { name: "Moderate", color: "#facc15", range: "51-100" },
  { name: "Unhealthy for Sensitive Groups", color: "#fb923c", range: "101-150" },
  { name: "Unhealthy", color: "#ef4444", range: "151-200" },
  { name: "Very Unhealthy", color: "#ec4899", range: "201-300" },
  { name: "Hazardous", color: "#7e22ce", range: "301+" }
];

interface Station {
  placeName: string;
  aqi: number;
  category: string;
  mainPollutant: string;
  mainPollutantValue: number;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const AirQualityDashboard = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jakartaPosition: [number, number] = [-6.223099, 106.791597];

  useEffect(() => {
    // Using mock data
    setStations(mockStations);
    setSelectedStation(mockStations[0]); // Select first station by default
    setLoading(false);
  }, []);

  // Get color based on AQI category
  const getAqiColor = (category: string) => {
    const found = aqiCategories.find(c => c.name === category);
    return found ? found.color : "#4ade80";
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Air Quality Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[450px] relative">
            <MapContainer
              center={jakartaPosition}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {stations.map((station, index) => (
                <Marker
                  key={index}
                  position={[station.lat, station.lng]}
                  eventHandlers={{
                    click: () => setSelectedStation(station)
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold mb-1">{station.placeName}</h3>
                      <p>AQI: {station.aqi}</p>
                      <p>Category: {station.category}</p>
                      <p>Main Pollutant: {station.mainPollutant}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* AQI Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000] pointer-events-auto">
                <h3 className="font-semibold text-sm mb-2">AQI Legend</h3>
                <div className="space-y-1">
                  {aqiCategories.map((category, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div 
                        className="w-4 h-4 mr-2 rounded-sm" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name} ({category.range})</span>
                    </div>
                  ))}
                </div>
              </div>
            </MapContainer>
          </div>
        </div>
        
        {/* Info Card - 1 column */}
        <div className="lg:col-span-1">
          {selectedStation && (
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{selectedStation.placeName}</h2>
                  <p className="text-gray-500">Air Quality Information</p>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col items-center mb-6">
                    <div 
                      className="text-6xl font-bold mb-2" 
                      style={{ color: getAqiColor(selectedStation.category) }}
                    >
                      {selectedStation.aqi}
                    </div>
                    <div 
                      className="text-lg font-medium px-4 py-1 rounded-full" 
                      style={{ 
                        backgroundColor: getAqiColor(selectedStation.category),
                        color: selectedStation.category === "Good" ? "#1f2937" : "white"
                      }}
                    >
                      {selectedStation.category}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2">Main Pollutant</h3>
                    <div className="text-xl font-medium">
                      {selectedStation.mainPollutant}: {selectedStation.mainPollutantValue} µg/m³
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                      <Thermometer className="h-6 w-6 text-blue-500 mb-1" />
                      <span className="text-sm text-gray-500">Temperature</span>
                      <span className="font-medium">{selectedStation.temperature}°C</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                      <Droplets className="h-6 w-6 text-blue-500 mb-1" />
                      <span className="text-sm text-gray-500">Humidity</span>
                      <span className="font-medium">{selectedStation.humidity}%</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                      <Wind className="h-6 w-6 text-blue-500 mb-1" />
                      <span className="text-sm text-gray-500">Wind</span>
                      <span className="font-medium">{selectedStation.windSpeed} m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirQualityDashboard;