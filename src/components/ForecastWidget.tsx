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
    if (aqi <= 50) return "bg-[#B2F5BE]";
    if (aqi <= 100) return "bg-[#B8D6FF]";
    if (aqi <= 150) return "bg-[#FFCA59]";
    if (aqi <= 200) return "bg-[#FFCA59]";
    if (aqi <= 300) return "bg-[#FD6E6E]";
    return "bg-[#3D3D3D]";
  };

  const bgColor = type === "hourly" ? "bg-hourly-forecast" : "bg-daily-forecast";
  const textColor = type === "hourly" ? "text-hourly-forecast-foreground" : "text-daily-forecast-foreground";

  return (
    <Card className={`h-full ${bgColor} rounded-2xl shadow-sm`}>
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-semibold ${textColor} flex items-center gap-2`}>
          {icon}
          {title}
        </CardTitle>
        <p className={`text-sm ${textColor}/80`}>
          Air quality index (AQI⁺) forecast
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-3">
          {mockData.map((item, index) => (
            <div 
              key={index}
              className="bg-white/80 rounded-xl p-3 min-w-[80px] text-center"
            >
              <div className="text-sm font-medium text-foreground mb-2">
                {item.time}
              </div>
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