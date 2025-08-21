import { Card } from "@/components/ui/card";
import { MapPin, Thermometer, Droplets, Wind } from "lucide-react";

interface AQICardProps {
  location: string;
  aqi: number;
  status: string;
  pollutant: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const AQICard = ({ 
  location, 
  aqi, 
  status, 
  pollutant, 
  temperature, 
  humidity, 
  windSpeed 
}: AQICardProps) => {
  return (
    <Card className="bg-aqi-card p-6 rounded-2xl shadow-sm">
      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-nav-active" />
        <span className="text-sm font-medium text-aqi-card-foreground">{location}</span>
      </div>
      
      {/* AQI Number */}
      <div className="mb-2">
        <div className="text-6xl font-bold text-aqi-card-foreground">{aqi}</div>
        <div className="text-lg font-semibold text-status-moderate mt-1">{status}</div>
      </div>
      
      {/* Description */}
      <div className="text-sm text-muted-foreground mb-4">
        Air quality is acceptable for most people
      </div>
      
      {/* Main Pollutant */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground">Main Pollutant</div>
        <div className="text-sm font-semibold text-aqi-card-foreground">{pollutant}</div>
      </div>
      
      {/* Weather Details */}
      <div className="flex items-center justify-between bg-status-moderate/20 rounded-lg px-3 py-2">
        <div className="flex items-center gap-1">
          <Thermometer className="h-4 w-4 text-aqi-card-foreground" />
          <span className="text-sm font-medium text-aqi-card-foreground">{temperature}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4 text-aqi-card-foreground" />
          <span className="text-sm font-medium text-aqi-card-foreground">{humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4 text-aqi-card-foreground" />
          <span className="text-sm font-medium text-aqi-card-foreground">{windSpeed} m/s</span>
        </div>
      </div>
    </Card>
  );
};

export default AQICard;