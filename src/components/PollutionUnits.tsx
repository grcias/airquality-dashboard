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
      value: 80,
      unit: "μg/m³",
      description: "Fine particles (≤ 2.5 μm)",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      status: "unhealthy"
    },
    {
      name: "PM10",
      value: 52,
      unit: "μg/m³", 
      description: "Coarse particles (≤ 10 μm)",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      status: "good"
    },
    {
      name: "O₃",
      value: 37.2,
      unit: "μg/m³",
      description: "Ozone",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      status: "good"
    },
    {
      name: "NO₂",
      value: 7.6,
      unit: "μg/m³",
      description: "Nitrogen Dioxide",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      status: "good"
    },
    {
      name: "SO₂",
      value: 13,
      unit: "μg/m³",
      description: "Sulphur Dioxide",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      status: "good"
    },
    {
      name: "CO",
      value: 795.3,
      unit: "μg/m³",
      description: "Carbon Monoxide",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      status: "good"
    },
  ];

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Air pollutants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What is the current air quality in Jakarta?
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto">
          {pollutants.map((pollutant, index) => {
            const getStatusColor = (status: string) => {
              if (status === "unhealthy") return "text-red-500";
              if (status === "moderate") return "text-yellow-500";
              return "text-green-500";
            };
            
            const getStatusDot = (status: string) => {
              if (status === "unhealthy") return "bg-red-500";
              if (status === "moderate") return "bg-yellow-500";
              return "bg-green-500";
            };
            
            return (
              <div 
                key={index}
                className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors relative flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {pollutant.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pollutant.description}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(pollutant.status)}`} />
                </div>
                
                <div className="flex items-baseline">
                  <span className={`text-xl font-bold ${getStatusColor(pollutant.status)}`}>
                    {pollutant.value}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
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