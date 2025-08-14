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
      icon: Droplets,
      description: "Fine particulate matter",
      safe: 12,
    },
    {
      name: "PM10",
      value: data.pm10,
      unit: "μg/m³", 
      icon: Wind,
      description: "Coarse particulate matter",
      safe: 50,
    },
    {
      name: "O₃",
      value: data.o3,
      unit: "ppb",
      icon: Zap,
      description: "Ground-level ozone",
      safe: 70,
    },
    {
      name: "NO₂",
      value: data.no2,
      unit: "ppb",
      icon: Gauge,
      description: "Nitrogen dioxide",
      safe: 53,
    },
  ];

  return (
    <Card className="h-full bg-gradient-to-br from-units-section to-units-section/80 border-2 border-units-section/30 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-units-foreground flex items-center gap-3">
          <Gauge className="h-6 w-6" />
          Pollution Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {pollutants.map((pollutant, index) => {
            const Icon = pollutant.icon;
            const isElevated = pollutant.value > pollutant.safe;
            
            return (
              <div 
                key={index}
                className="bg-units-foreground/10 rounded-lg p-4 hover:bg-units-foreground/15 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-units-foreground" />
                    <div>
                      <div className="font-bold text-units-foreground">
                        {pollutant.name}
                      </div>
                      <div className="text-xs text-units-foreground/70">
                        {pollutant.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-units-foreground">
                      {pollutant.value.toFixed(1)}
                    </div>
                    <div className="text-xs text-units-foreground/70">
                      {pollutant.unit}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-units-foreground/20 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isElevated ? 'bg-red-400' : 'bg-green-400'
                    }`}
                    style={{ 
                      width: `${Math.min((pollutant.value / (pollutant.safe * 2)) * 100, 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-units-foreground/60 mt-1">
                  <span>0</span>
                  <span className="text-green-300">Safe: {pollutant.safe}</span>
                  <span>{(pollutant.safe * 2).toFixed(0)}+</span>
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