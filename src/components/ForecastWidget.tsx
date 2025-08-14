import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { getAQILevel } from "@/types/airQuality";

interface ForecastItem {
  time: string;
  aqi: number;
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
          { time: "12 PM", aqi: 65 },
          { time: "1 PM", aqi: 72 },
          { time: "2 PM", aqi: 78 },
          { time: "3 PM", aqi: 85 },
          { time: "4 PM", aqi: 82 },
          { time: "5 PM", aqi: 75 },
        ]
      : [
          { time: "Today", aqi: 68 },
          { time: "Tomorrow", aqi: 73 },
          { time: "Wednesday", aqi: 81 },
          { time: "Thursday", aqi: 76 },
          { time: "Friday", aqi: 69 },
        ]
  );

  const defaultIcon = type === "hourly" ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />;

  return (
    <Card className="h-full bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          {icon || defaultIcon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {mockData.map((item, index) => {
            const aqiLevel = getAQILevel(item.aqi);
            
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: aqiLevel.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {item.time}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">
                    {item.aqi}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    AQI
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              {type === "hourly" ? "Next 6 hours" : "Next 5 days"} forecast
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWidget;