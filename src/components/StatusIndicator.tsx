import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAQILevel } from "@/types/airQuality";

interface StatusIndicatorProps {
  aqi: number;
  location?: string;
}

const StatusIndicator = ({ aqi, location = "your area" }: StatusIndicatorProps) => {
  const aqiLevel = getAQILevel(aqi);
  
  const getIcon = () => {
    if (aqi <= 50) return <CheckCircle className="h-8 w-8" style={{ color: aqiLevel.color }} />;
    if (aqi <= 100) return <AlertTriangle className="h-8 w-8" style={{ color: aqiLevel.color }} />;
    return <XCircle className="h-8 w-8" style={{ color: aqiLevel.color }} />;
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
      <CardContent className="p-6 h-full flex flex-col justify-center">
        <div className="flex items-center space-x-4 mb-4">
          {getIcon()}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Air Quality Status
            </h3>
            <p className="text-lg text-muted-foreground">
              Currently in {location}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">AQI Level:</span>
            <span 
              className="text-lg font-bold px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: aqiLevel.color + '20',
                color: aqiLevel.color 
              }}
            >
              {aqiLevel.level}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">AQI Value:</span>
            <span className="text-2xl font-bold text-foreground">{aqi}</span>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            {aqiLevel.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusIndicator;