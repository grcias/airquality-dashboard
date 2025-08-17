import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Thermometer, Droplets, Wind } from "lucide-react";
import { getAQILevel } from "@/types/airQuality";
interface StationData {
  city: string;
  country: string;
  aqi: number;
  lat: number;
  lng: number;
  mainPollutant?: string;
  pollutantValue?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}
interface InteractiveAirQualityMapProps {
  stations: StationData[];
  selectedCity: string;
}

// Simple visual map representation for now
const SimpleMapView = ({
  stations,
  onStationClick
}: {
  stations: StationData[];
  onStationClick: (station: StationData) => void;
}) => {
  return <div className="relative h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-blue-200 dark:border-blue-700/50 overflow-hidden">
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
        backgroundImage: `
            radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)
          `,
        backgroundSize: '50px 50px'
      }} />
      </div>
      
      {/* Station markers */}
      {stations.map((station, index) => {
      const aqiLevel = getAQILevel(station.aqi);
      return <button key={index} onClick={() => onStationClick(station)} className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200 cursor-pointer flex items-center justify-center text-white text-xs font-bold" style={{
        backgroundColor: aqiLevel.color,
        left: `${20 + index * 12}%`,
        top: `${30 + index % 4 * 15}%`
      }} title={`${station.city}: AQI ${station.aqi}`}>
            {station.aqi}
          </button>;
    })}
      
      {/* Map title overlay */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
        <div className="text-sm font-medium text-gray-900 dark:text-white">Air Quality Monitoring Stations</div>
        <div className="text-xs text-gray-600 dark:text-gray-300">Click stations to view details</div>
      </div>

      {/* Fixed AQI Legend at bottom - hidden on mobile */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg hidden md:block">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-16 h-6 rounded text-xs font-bold flex items-center justify-center text-white" style={{
            backgroundColor: '#22c55e'
          }}>
              Good
            </div>
            <div style={{
            backgroundColor: '#facc15'
          }} className="w-18 h-6 rounded text-xs font-bold flex items-center justify-center text-white mx-2">
              Moderate
            </div>
            <div className="w-20 h-6 rounded text-xs font-bold flex items-center justify-center text-white" style={{
            backgroundColor: '#f97316'
          }}>
              Unhealthy
            </div>
            <div className="w-24 h-6 rounded text-xs font-bold flex items-center justify-center text-white" style={{
            backgroundColor: '#ef4444'
          }}>
              Very Unhealthy
            </div>
            <div className="w-20 h-6 rounded text-xs font-bold flex items-center justify-center text-white" style={{
            backgroundColor: '#a855f7'
          }}>
              Hazardous
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const StationCard = ({
  station
}: {
  station: StationData;
}) => {
  const aqiLevel = getAQILevel(station.aqi);
  return <Card className="w-80 border-2 shadow-lg" style={{
    borderColor: aqiLevel.color
  }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          {station.city}, {station.country}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold mb-1" style={{
          color: aqiLevel.color
        }}>
            {station.aqi}
          </div>
          <div className="text-lg font-semibold" style={{
          color: aqiLevel.color
        }}>
            {aqiLevel.level}
          </div>
          <div className="text-sm text-muted-foreground">
            {aqiLevel.description}
          </div>
        </div>
        
        {station.mainPollutant && <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm font-medium mb-1">Main Pollutant</div>
            <div className="font-semibold">
              {station.mainPollutant}: {station.pollutantValue} µg/m³
            </div>
          </div>}
        
        <div className="grid grid-cols-3 gap-3 text-sm">
          {station.temperature && <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span>{station.temperature}°C</span>
            </div>}
          {station.humidity && <div className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>{station.humidity}%</span>
            </div>}
          {station.windSpeed && <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>{station.windSpeed} m/s</span>
            </div>}
        </div>
      </CardContent>
    </Card>;
};
const InteractiveAirQualityMap = ({
  stations,
  selectedCity
}: InteractiveAirQualityMapProps) => {
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  // Enhanced mock data with weather information
  const enhancedStations = stations.map(station => ({
    ...station,
    mainPollutant: 'PM2.5',
    pollutantValue: Math.round(25 + Math.random() * 50),
    temperature: Math.round(15 + Math.random() * 20),
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round((2 + Math.random() * 8) * 10) / 10
  }));

  // Set initial selected station to main city
  useEffect(() => {
    const mainStation = enhancedStations.find(s => s.city.toLowerCase().includes(selectedCity.toLowerCase()));
    if (mainStation) {
      setSelectedStation(mainStation);
    } else if (enhancedStations.length > 0) {
      setSelectedStation(enhancedStations[0]);
    }
  }, [selectedCity, stations]);
  return <div className="space-y-4">
      <Card className="h-[500px] relative overflow-hidden">
        <CardContent className="p-0 h-full">
          <SimpleMapView stations={enhancedStations} onStationClick={setSelectedStation} />
          
          {/* Floating station card overlay */}
          {selectedStation && <div className="absolute top-4 right-4 z-10">
              <StationCard station={selectedStation} />
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default InteractiveAirQualityMap;