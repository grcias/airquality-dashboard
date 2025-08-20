import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          { time: "8 pm", aqi: 90 },
          { time: "9 pm", aqi: 93 },
          { time: "10 pm", aqi: 99 },
          { time: "11 pm", aqi: 83 },
          { time: "12 am", aqi: 64 },
          { time: "1 am", aqi: 94 },
        ]
      : [
          { time: "Today", aqi: 94 },
          { time: "Tomorrow", aqi: 93 },
          { time: "Wednesday", aqi: 78 },
          { time: "Thursday", aqi: 57 },
          { time: "Friday", aqi: 57 },
        ]
  );

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-red-800";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {type === "daily" && (
          <p className="text-sm text-muted-foreground">
            Jakarta air quality index (AQI⁺) forecast
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-3">
          {mockData.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm font-medium text-foreground">
                {item.time}
              </span>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getAQIColor(item.aqi)}`}>
                {item.aqi}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWidget;