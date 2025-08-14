import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AveragePollutionProps {
  averageAQI: number;
  previousAQI?: number;
}

const AveragePollution = ({ averageAQI, previousAQI }: AveragePollutionProps) => {
  const getTrend = () => {
    if (!previousAQI) return { icon: Minus, text: "No previous data", color: "text-muted-foreground" };
    
    const diff = averageAQI - previousAQI;
    if (diff > 5) return { 
      icon: TrendingUp, 
      text: `+${diff.toFixed(1)} from yesterday`,
      color: "text-red-500"
    };
    if (diff < -5) return { 
      icon: TrendingDown, 
      text: `${diff.toFixed(1)} from yesterday`,
      color: "text-green-500"
    };
    return { 
      icon: Minus, 
      text: "Stable from yesterday",
      color: "text-pollution-avg-foreground/70"
    };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  return (
    <Card className="h-full bg-gradient-to-br from-pollution-avg to-pollution-avg/80 border-2 border-pollution-avg/30 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-pollution-avg-foreground flex items-center gap-3">
          <Activity className="h-6 w-6" />
          Average Air Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-pollution-avg-foreground">
              {averageAQI.toFixed(0)}
            </div>
            <div className="text-xl font-semibold text-pollution-avg-foreground/80">
              AQI Index
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <TrendIcon className={`h-5 w-5 ${trend.color}`} />
            <span className={`text-sm font-medium ${trend.color}`}>
              {trend.text}
            </span>
          </div>
          
          <div className="bg-pollution-avg-foreground/10 rounded-lg p-4 mt-4">
            <div className="text-sm text-pollution-avg-foreground/80 mb-2">
              Based on all monitoring stations
            </div>
            <div className="w-full bg-pollution-avg-foreground/20 rounded-full h-2">
              <div 
                className="bg-pollution-avg-foreground h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((averageAQI / 200) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-pollution-avg-foreground/60 mt-1">
              <span>0</span>
              <span>Good</span>
              <span>Moderate</span>
              <span>Unhealthy</span>
              <span>200+</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AveragePollution;