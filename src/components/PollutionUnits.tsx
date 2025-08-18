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
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Air pollutants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What is the current air quality in Jakarta?
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {pollutants.map((pollutant, index) => {
            const getStatusColor = (name: string, value: number) => {
              if (name === "PM2.5" && value > 35) return "bg-orange-500";
              if (name === "PM10" && value > 50) return "bg-orange-500";
              if (value > 100) return "bg-red-500";
              if (value > 50) return "bg-yellow-500";
              return "bg-green-500";
            };
            
            return (
              <div 
                key={index}
                className="bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors relative h-20 flex flex-col justify-between"
              >
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${getStatusColor(pollutant.name, pollutant.value)}`} />
                <div>
                  <div className="font-bold text-foreground text-sm">
                    {pollutant.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pollutant.description}
                  </div>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold text-foreground">
                    {pollutant.value.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pollutant.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionUnits;