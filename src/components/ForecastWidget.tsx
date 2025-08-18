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
          { time: "12 PM", aqi: 65, temperature: { high: 28, low: 22 }, humidity: 68, wind: 12.5, weather: "cloudy" },
          { time: "1 PM", aqi: 72, temperature: { high: 29, low: 23 }, humidity: 65, wind: 14.2, weather: "sunny" },
          { time: "2 PM", aqi: 78, temperature: { high: 30, low: 24 }, humidity: 62, wind: 15.8, weather: "cloudy" },
          { time: "3 PM", aqi: 85, temperature: { high: 31, low: 25 }, humidity: 58, wind: 16.3, weather: "rainy" },
          { time: "4 PM", aqi: 82, temperature: { high: 30, low: 24 }, humidity: 61, wind: 14.7, weather: "cloudy" },
          { time: "5 PM", aqi: 75, temperature: { high: 29, low: 23 }, humidity: 64, wind: 13.2, weather: "sunny" },
        ]
      : [
          { time: "Today", aqi: 118, temperature: { high: 33, low: 27 }, humidity: 53, wind: 21.6, weather: "rainy" },
          { time: "Tue", aqi: 131, temperature: { high: 28, low: 22 }, humidity: 97, wind: 14.4, weather: "cloudy" },
          { time: "Wed", aqi: 136, temperature: { high: 30, low: 23 }, humidity: 59, wind: 10.8, weather: "rainy" },
          { time: "Thu", aqi: 103, temperature: { high: 29, low: 24 }, humidity: 63, wind: 10.8, weather: "rainy" },
          { time: "Fri", aqi: 79, temperature: { high: 30, low: 24 }, humidity: 67, wind: 10.8, weather: "rainy" },
          { time: "Sat", aqi: 67, temperature: { high: 32, low: 24 }, humidity: 63, wind: 18.0, weather: "cloudy" },
          { time: "Sun", aqi: 71, temperature: { high: 32, low: 25 }, humidity: 63, wind: 14.4, weather: "cloudy" },
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
    <Card className="h-full bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
      <CardHeader className="pb-3">
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
      <CardContent className="p-4">
        <div className="space-y-2">
          {mockData.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground min-w-[60px]">
                  {item.time}
                </span>
                <div className={`px-2 py-1 rounded text-white text-sm font-bold min-w-[50px] text-center ${getAQIColor(item.aqi)}`}>
                  {item.aqi}
                </div>
                {type === "daily" && item.weather && (
                  <div className="flex items-center space-x-1">
                    {getWeatherIcon(item.weather)}
                    <span className="text-xs text-muted-foreground opacity-75">100%</span>
                  </div>
                )}
              </div>
              
              {type === "daily" && item.temperature && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{item.temperature.high}°</span>
                    <span className="text-muted-foreground">{item.temperature.low}°</span>
                  </div>
                  {item.wind && (
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Wind className="h-3 w-3" />
                      <span className="text-xs">{item.wind} km/h</span>
                    </div>
                  )}
                  {item.humidity && (
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Droplets className="h-3 w-3" />
                      <span className="text-xs">{item.humidity}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWidget;