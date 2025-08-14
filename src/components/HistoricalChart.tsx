import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart } from 'recharts';
import { BarChart3 } from "lucide-react";

interface HistoricalDataPoint {
  date: string;
  aqi: number;
}

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
}

const HistoricalChart = ({ data }: HistoricalChartProps) => {
  // Mock historical data if none provided
  const mockData = data.length > 0 ? data : [
    { date: 'Jan 1', aqi: 45 },
    { date: 'Jan 2', aqi: 62 },
    { date: 'Jan 3', aqi: 78 },
    { date: 'Jan 4', aqi: 85 },
    { date: 'Jan 5', aqi: 72 },
    { date: 'Jan 6', aqi: 58 },
    { date: 'Jan 7', aqi: 91 },
    { date: 'Jan 8', aqi: 104 },
    { date: 'Jan 9', aqi: 89 },
    { date: 'Jan 10', aqi: 67 },
    { date: 'Jan 11', aqi: 54 },
    { date: 'Jan 12', aqi: 76 },
    { date: 'Jan 13', aqi: 82 },
    { date: 'Jan 14', aqi: 69 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const aqi = payload[0].value;
      let level = "Good";
      let color = "#22c55e";
      
      if (aqi > 50) { level = "Moderate"; color = "#eab308"; }
      if (aqi > 100) { level = "Unhealthy"; color = "#ef4444"; }
      if (aqi > 150) { level = "Very Unhealthy"; color = "#dc2626"; }
      
      return (
        <div className="bg-chart-foreground p-3 rounded-lg shadow-lg border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-lg font-bold" style={{ color }}>
            AQI: {aqi}
          </p>
          <p className="text-xs" style={{ color }}>
            {level}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full bg-gradient-to-br from-chart-section to-chart-section/80 border-2 border-chart-section/30 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-chart-foreground flex items-center gap-3">
          <BarChart3 className="h-6 w-6" />
          Historical Air Quality Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.8)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.8)"
                fontSize={12}
              />
              <Line 
                type="monotone" 
                dataKey="aqi" 
                stroke="#fff"
                strokeWidth={3}
                dot={{ fill: '#fff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: 'rgba(255,255,255,0.8)' }}
              />
              <CustomTooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-chart-foreground/10 rounded-lg p-3">
            <div className="text-sm text-chart-foreground/70 mb-1">14-Day Average</div>
            <div className="text-xl font-bold text-chart-foreground">
              {(mockData.reduce((sum, item) => sum + item.aqi, 0) / mockData.length).toFixed(0)}
            </div>
          </div>
          <div className="bg-chart-foreground/10 rounded-lg p-3">
            <div className="text-sm text-chart-foreground/70 mb-1">Peak AQI</div>
            <div className="text-xl font-bold text-chart-foreground">
              {Math.max(...mockData.map(item => item.aqi))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;