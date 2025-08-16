import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Thermometer, Droplets, Wind } from "lucide-react";
import { getAQILevel } from "@/types/airQuality";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// Custom marker component
const createCustomIcon = (aqi: number) => {
  const aqiLevel = getAQILevel(aqi);
  const color = aqiLevel.color.replace('hsl(var(--status-', '').replace('))', '');
  
  // Convert semantic color to actual hex
  const colorMap: { [key: string]: string } = {
    'good': '#10b981',
    'moderate': '#f59e0b',
    'unhealthy': '#ef4444',
    'hazardous': '#7c2d12'
  };
  
  const iconColor = colorMap[color] || '#ef4444';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${iconColor};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: white;
    ">${aqi}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

const AQILegend = () => {
  const aqiRanges = [
    { range: '0-50', label: 'Good', color: 'hsl(var(--status-good))' },
    { range: '51-100', label: 'Moderate', color: 'hsl(var(--status-moderate))' },
    { range: '101-150', label: 'Unhealthy for Sensitive Groups', color: 'hsl(var(--status-unhealthy))' },
    { range: '151-200', label: 'Unhealthy', color: 'hsl(var(--status-unhealthy))' },
    { range: '201-300', label: 'Very Unhealthy', color: 'hsl(var(--status-hazardous))' },
    { range: '301+', label: 'Hazardous', color: 'hsl(var(--status-hazardous))' }
  ];

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">AQI Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {aqiRanges.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div 
                className="w-full h-8 rounded mb-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-xs font-medium">{item.range}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StationCard = ({ station }: { station: StationData }) => {
  const aqiLevel = getAQILevel(station.aqi);
  
  return (
    <Card className="w-80 border-2 shadow-lg" style={{ borderColor: aqiLevel.color }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          {station.city}, {station.country}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold mb-1" style={{ color: aqiLevel.color }}>
            {station.aqi}
          </div>
          <div className="text-lg font-semibold" style={{ color: aqiLevel.color }}>
            {aqiLevel.level}
          </div>
          <div className="text-sm text-muted-foreground">
            {aqiLevel.description}
          </div>
        </div>
        
        {station.mainPollutant && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm font-medium mb-1">Main Pollutant</div>
            <div className="font-semibold">
              {station.mainPollutant}: {station.pollutantValue} µg/m³
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3 text-sm">
          {station.temperature && (
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span>{station.temperature}°C</span>
            </div>
          )}
          {station.humidity && (
            <div className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>{station.humidity}%</span>
            </div>
          )}
          {station.windSpeed && (
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>{station.windSpeed} m/s</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const InteractiveAirQualityMap = ({ stations, selectedCity }: InteractiveAirQualityMapProps) => {
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

  const defaultCenter: [number, number] = enhancedStations.length > 0 
    ? [enhancedStations[0].lat, enhancedStations[0].lng] 
    : [39.8283, -98.5795]; // Center of USA

  return (
    <div className="space-y-4">
      <Card className="h-[500px] relative overflow-hidden">
        <CardContent className="p-0 h-full">
          <MapContainer
            center={defaultCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {enhancedStations.map((station, index) => (
              <Marker
                key={index}
                position={[station.lat, station.lng]}
                icon={createCustomIcon(station.aqi)}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold">{station.city}</div>
                    <div className="text-lg font-bold">AQI: {station.aqi}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Floating station card overlay */}
          {selectedStation && (
            <div className="absolute top-4 right-4 z-[1000]">
              <StationCard station={selectedStation} />
            </div>
          )}
        </CardContent>
      </Card>
      
      <AQILegend />
    </div>
  );
};

export default InteractiveAirQualityMap;