import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Wind, Droplets, Zap } from "lucide-react";
import { PollutionData } from "@/types/airQuality";

interface PollutionUnitsProps {
  data: PollutionData;
}

const PollutionUnits = ({ data }: PollutionUnitsProps) => {
  const pollutants = [
    {
      name: "PM2.5",
      value: data.pm25,
      unit: "μg/m³",
      description: "Fine particles (≤ 2.5 μm)",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "PM10",
      value: data.pm10,
      unit: "μg/m³", 
      description: "Coarse particles (≤ 10 μm)",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "O₃",
      value: data.o3,
      unit: "μg/m³",
      description: "Ozone",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "NO₂",
      value: data.no2,
      unit: "μg/m³",
      description: "Nitrogen Dioxide",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "SO₂",
      value: 19.3,
      unit: "μg/m³",
      description: "Sulphur Dioxide",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "CO",
      value: 985.7,
      unit: "μg/m³",
      description: "Carbon Monoxide",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Card className="h-full bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Air pollutants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What is the current air quality in Jakarta?
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {pollutants.map((pollutant, index) => (
            <div 
              key={index}
              className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-foreground">
                    {pollutant.name}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${pollutant.color.replace('text-', 'bg-')}`} />
                </div>
                <div className="text-xs text-muted-foreground">
                  {pollutant.description}
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className={`text-2xl font-bold ${pollutant.color}`}>
                    {pollutant.value.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pollutant.unit}
                  </span>
                  <sup className="text-xs text-muted-foreground">3</sup>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionUnits;