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
    <Card className="bg-white p-6 rounded-2xl shadow-sm overflow-hidden border border-[#FFCA59]/20">
      {/* Location pill */}
      <div className="flex items-center mb-5">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 whitespace-nowrap max-w-full">
          <span className="inline-flex items-center justify-center rounded-full bg-red-500/10 text-red-500 w-5 h-5">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium text-gray-700 truncate max-w-[220px]">{location}</span>
        </div>
      </div>

      {/* AQI value and status */}
      <div className="mb-2">
        <div className="text-6xl font-bold text-[#FFCA59] leading-none">{aqi}</div>
        <div className="text-lg font-semibold text-[#FFCA59] mt-1">{status}</div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-500 mb-5">
        Air quality is acceptable for most people
      </div>

      {/* Main Pollutant box */}
      <div className="mb-6">
        <div className="rounded-xl bg-gray-100 px-3 py-3">
          <div className="text-xs text-gray-500">Main Pollutant</div>
          <div className="text-sm font-semibold text-gray-800">{pollutant}</div>
        </div>
      </div>

      {/* Footer: weather details on orange gradient */}
      <div className="mt-6 -mx-6 -mb-6 px-5 py-3 bg-gradient-to-b from-[#FFCA59] to-[#FFB01F] flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-800">
          <Thermometer className="h-4 w-4" />
          <span className="text-sm font-medium">{temperature}°C</span>
        </div>
        <div className="flex items-center gap-1 text-gray-800">
          <Droplets className="h-4 w-4" />
          <span className="text-sm font-medium">{humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-gray-800">
          <Wind className="h-4 w-4" />
          <span className="text-sm font-medium">{windSpeed} km/h</span>
        </div>
      </div>
    </Card>
  );
};

export default AQICard;