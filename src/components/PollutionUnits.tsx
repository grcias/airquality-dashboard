import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      status: "unhealthy"
    },
    {
      name: "PM10",
      value: 52,
      unit: "μg/m³", 
      description: "Coarse particles (≤ 10 μm)",
      status: "good"
    },
    {
      name: "O₃",
      value: 37.2,
      unit: "μg/m³",
      description: "Ozone",
      status: "good"
    },
    {
      name: "NO₂",
      value: 7.6,
      unit: "μg/m³",
      description: "Nitrogen Dioxide",
      status: "good"
    },
    {
      name: "SO₂",
      value: 13,
      unit: "μg/m³",
      description: "Sulphur Dioxide",
      status: "good"
    },
    {
      name: "CO",
      value: 795.3,
      unit: "μg/m³",
      description: "Carbon Monoxide",
      status: "good"
    },
  ];

  const getStatusDot = (status: string) => {
    if (status === "unhealthy") return "bg-red-500";
    if (status === "moderate") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getValueColor = (status: string) => {
    if (status === "unhealthy") return "text-red-500";
    if (status === "moderate") return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Air pollutants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What is the current air quality in Jakarta?
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {pollutants.map((pollutant, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(pollutant.status)}`} />
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {pollutant.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pollutant.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold text-lg ${getValueColor(pollutant.status)}`}>
                {pollutant.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {pollutant.unit}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PollutionUnits;