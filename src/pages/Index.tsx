import { useState, useEffect } from "react";
import Header from "@/components/Header";
import InteractiveAirQualityMap from "@/components/InteractiveAirQualityMap";
import AveragePollution from "@/components/AveragePollution";
import PollutionUnits from "@/components/PollutionUnits";
import ForecastWidget from "@/components/ForecastWidget";
import HistoricalChart from "@/components/HistoricalChart";
import { airQualityAPI } from "@/services/airQualityAPI";
import { Clock, Calendar } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentAQI, setCurrentAQI] = useState(0);
  const [stationsData, setStationsData] = useState([]);
  const [averageAQI, setAverageAQI] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Los Angeles");
  const [pollutionUnits, setPollutionUnits] = useState({
    pm25: 0,
    pm10: 0,
    o3: 0,
    no2: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAirQualityData();
  }, []);

  const loadAirQualityData = async () => {
    try {
      setIsLoading(true);
      
      // Load main city data
      const mainCityData = await airQualityAPI.getNearestCityData();
      const currentAqi = mainCityData.data.current.pollution.aqius;
      setCurrentAQI(currentAqi);
      setSelectedCity(mainCityData.data.city);

      // Load multiple stations data
      const stations = await airQualityAPI.getMultipleCitiesData();
      setStationsData(stations);

      // Calculate average AQI
      const avgAqi = stations.reduce((sum: number, station: any) => sum + station.aqi, 0) / stations.length;
      setAverageAQI(avgAqi);

      // Generate pollution units data
      const unitsData = airQualityAPI.generatePollutionUnitsData();
      setPollutionUnits(unitsData);

    } catch (error) {
      console.error("Error loading air quality data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="text-xl text-muted-foreground">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "home" && (
        <main className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Air Quality Status
            </h1>
            <p className="text-xl text-muted-foreground">
              Air Quality Index (AQI⁺) and PM2.5 pollution in {selectedCity}
            </p>
          </div>

          {/* Interactive Map Section */}
          <div className="mb-8">
            <InteractiveAirQualityMap 
              stations={stationsData} 
              selectedCity={selectedCity}
            />
          </div>

          {/* Data Sections */}
          <div className="space-y-8">
            {/* Average Pollution */}
            <AveragePollution averageAQI={averageAQI} previousAQI={averageAQI - 5} />

            {/* Units + Forecasts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PollutionUnits data={pollutionUnits} />
              <ForecastWidget 
                title="Hourly Forecast" 
                type="hourly" 
                data={airQualityAPI.generateForecastData('hourly')}
                icon={<Clock className="h-5 w-5" />}
              />
              <ForecastWidget 
                title="Daily Forecast" 
                type="daily" 
                data={airQualityAPI.generateForecastData('daily')}
                icon={<Calendar className="h-5 w-5" />}
              />
            </div>

            {/* Historical Chart */}
            <HistoricalChart data={airQualityAPI.generateHistoricalData()} />
          </div>
        </main>
      )}

      {activeTab === "forecast" && (
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Extended Forecast</h2>
            <p className="text-muted-foreground mb-8">Detailed air quality predictions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ForecastWidget 
                title="Next 24 Hours" 
                type="hourly" 
                data={airQualityAPI.generateForecastData('hourly')}
              />
              <ForecastWidget 
                title="Next 7 Days" 
                type="daily" 
                data={airQualityAPI.generateForecastData('daily')}
              />
            </div>
          </div>
        </main>
      )}

      {activeTab === "graph" && (
        <main className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Historical Data</h2>
            <p className="text-muted-foreground">Air quality trends and analysis</p>
          </div>
          <HistoricalChart data={airQualityAPI.generateHistoricalData()} />
        </main>
      )}

      {activeTab === "stations" && (
        <main className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Monitoring Stations</h2>
            <p className="text-muted-foreground">Real-time data from air quality monitoring networks</p>
          </div>
          <InteractiveAirQualityMap 
            stations={stationsData} 
            selectedCity={selectedCity}
          />
        </main>
      )}
    </div>
  );
};

export default Index;
