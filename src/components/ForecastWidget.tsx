import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, TrendingUp, Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react";
import { getAQILevel } from "@/types/airQuality";

interface ForecastItem {
  time: string;
  aqi: number;
  temperature?: {
    high: number;
    low: number;
  };
  humidity?: number;
  wind?: number;
  weather?: string;
}

interface ForecastWidgetProps {
  title: string;
  type: "hourly" | "daily";
  data: ForecastItem[];
  icon?: React.ReactNode;
}

const ForecastWidget = ({ title, type, data, icon }: ForecastWidgetProps) => {
  const mockData = data.length > 0 ? data : (
    type === "hourly" 
      ? [
          { time: "10 AM", aqi: 55, temperature: { high: 26, low: 21 }, humidity: 70, wind: 10.5, weather: "sunny" },
          { time: "11 AM", aqi: 60, temperature: { high: 27, low: 22 }, humidity: 69, wind: 11.2, weather: "sunny" },
          { time: "12 PM", aqi: 65, temperature: { high: 28, low: 22 }, humidity: 68, wind: 12.5, weather: "cloudy" },
          { time: "1 PM", aqi: 72, temperature: { high: 29, low: 23 }, humidity: 65, wind: 14.2, weather: "sunny" },
          { time: "2 PM", aqi: 78, temperature: { high: 30, low: 24 }, humidity: 62, wind: 15.8, weather: "cloudy" },
          { time: "3 PM", aqi: 85, temperature: { high: 31, low: 25 }, humidity: 58, wind: 16.3, weather: "rainy" },
          { time: "4 PM", aqi: 82, temperature: { high: 30, low: 24 }, humidity: 61, wind: 14.7, weather: "cloudy" },
          { time: "5 PM", aqi: 75, temperature: { high: 29, low: 23 }, humidity: 64, wind: 13.2, weather: "sunny" },
          { time: "6 PM", aqi: 70, temperature: { high: 28, low: 22 }, humidity: 66, wind: 12.0, weather: "sunny" },
          { time: "7 PM", aqi: 65, temperature: { high: 27, low: 21 }, humidity: 68, wind: 10.8, weather: "cloudy" },
          { time: "8 PM", aqi: 60, temperature: { high: 26, low: 20 }, humidity: 70, wind: 9.5, weather: "cloudy" },
        ]
      : [
          { time: "Mon", aqi: 157, temperature: { high: 28, low: 26 }, humidity: 78, wind: 10.8, weather: "cloudy" },
          { time: "Tue", aqi: 124, temperature: { high: 35, low: 25 }, humidity: 58, wind: 14.4, weather: "sunny" },
          { time: "Wed", aqi: 127, temperature: { high: 29, low: 25 }, humidity: 65, wind: 10.8, weather: "cloudy" },
          { time: "Thu", aqi: 134, temperature: { high: 31, low: 24 }, humidity: 57, wind: 14.4, weather: "rainy" },
          { time: "Fri", aqi: 104, temperature: { high: 31, low: 25 }, humidity: 61, wind: 10.8, weather: "cloudy" },
          { time: "Sat", aqi: 80, temperature: { high: 32, low: 25 }, humidity: 61, wind: 14.4, weather: "sunny" },
          { time: "Sun", aqi: 73, temperature: { high: 31, low: 25 }, humidity: 62, wind: 10.8, weather: "cloudy" },
        ]
  );

  const defaultIcon = type === "hourly" ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />;

  const getWeatherIcon = (weather: string = "sunny") => {
    switch (weather) {
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case "sunny":
      default:
        return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-red-800";
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          {icon || defaultIcon}
          {title}
        </CardTitle>
        {type === "daily" && (
          <p className="text-sm text-muted-foreground">
            Jakarta air quality index (AQI⁺) forecast
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {type === "hourly" ? (
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-4 pb-2 min-w-max">
              {mockData.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors h-[90px] w-[100px] shrink-0"
                >
                  <span className="text-sm font-medium text-foreground mb-1">
                    {item.time}
                  </span>
                  
                  <div className="flex items-center justify-center mb-1">
                    {item.weather && getWeatherIcon(item.weather)}
                  </div>
                  
                  <div className={`px-2 py-0.5 rounded text-white text-xs font-bold mb-1 ${getAQIColor(item.aqi)}`}>
                    {item.aqi}
                  </div>
                  
                  {item.temperature && (
                    <div className="text-sm text-foreground font-medium">
                      {item.temperature.high}°
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-4 pb-2 min-w-max">
              {mockData.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors min-h-[120px] w-[130px] shrink-0"
                >
                  <span className="text-sm font-medium text-foreground mb-2">
                    {item.time}
                  </span>
                  
                  <div className="flex justify-center mb-2">
                    {item.weather && getWeatherIcon(item.weather)}
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-white text-sm font-bold mb-2 self-center ${getAQIColor(item.aqi)}`}>
                    {item.aqi}
                  </div>
                
                  {item.temperature && (
                    <div className="text-center mb-1">
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <span className="font-medium">{item.temperature.high}°</span>
                        <span className="text-muted-foreground">{item.temperature.low}°</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between w-full mt-1">
                    {item.humidity && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <span>{item.humidity}%</span>
                      </div>
                    )}
                    
                    {item.wind && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Wind className="h-3 w-3" />
                        <span>{item.wind}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForecastWidget;