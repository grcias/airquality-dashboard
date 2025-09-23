import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/components/LeafletFix.css';
import L from 'leaflet';
import Header from "@/components/Header";
import { airQualityAPI } from "@/services/airQualityAPI";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

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

const Stations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stations");
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
      navigate('/#forecast-section');
    } else if (tab === 'graph') {
      navigate('/#history-section');
    } else if (tab === 'home') {
      navigate('/');
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
      } catch (error) {
        console.error('Error parsing stored city data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Mock data with proper structure for Stations page
      const mockData: CityData = {
        name: searchQuery,
        country: searchQuery === 'Jakarta' ? 'Indonesia' : 'Unknown',
        lat: searchQuery === 'Jakarta' ? -6.223099 : 0,
        lng: searchQuery === 'Jakarta' ? 106.791597 : 0,
        aqi: 85,
        category: "Moderate",
        mainPollutant: "PM2.5",
        mainPollutantValue: 53,
        temperature: 29,
        humidity: 56,
        windSpeed: 1.1
      };
      setCurrentCityData(mockData);
      localStorage.setItem('lastSearchedCity', JSON.stringify(mockData));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFDFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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

      <main className="container mx-auto px-6 py-8" style={{ backgroundColor: '#FAFDFF' }}>
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
    </div>
  );
};

export default Stations;