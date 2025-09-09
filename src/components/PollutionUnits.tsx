import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PollutionData } from "@/types/airQuality";

interface PollutionUnitsProps {
  data: PollutionData;
}

const PollutionUnits = ({ data }: PollutionUnitsProps) => {
  // Determine status based on pollutant values
  const getPollutantStatus = (name: string, value: number) => {
    // These thresholds are simplified and should be adjusted based on actual AQI standards
    switch(name) {
      case "PM2.5":
        return value > 35 ? "unhealthy" : value > 12 ? "moderate" : "good";
      case "PM10":
        return value > 150 ? "unhealthy" : value > 54 ? "moderate" : "good";
      case "O₃":
        return value > 70 ? "unhealthy" : value > 54 ? "moderate" : "good";
      case "NO₂":
        return value > 100 ? "unhealthy" : value > 53 ? "moderate" : "good";
      case "SO₂":
        return value > 75 ? "unhealthy" : value > 35 ? "moderate" : "good";
      case "CO":
        return value > 9 ? "unhealthy" : value > 4.4 ? "moderate" : "good";
      default:
        return "good";
    }
  };
  
  const pollutants = [
    {
      name: "PM2.5",
      value: data.pm25,
      unit: "μg/m³",
      description: "Fine particles (≤ 2.5 μm)",
      status: getPollutantStatus("PM2.5", data.pm25)
    },
    {
      name: "PM10",
      value: data.pm10,
      unit: "μg/m³", 
      description: "Coarse particles (≤ 10 μm)",
      status: getPollutantStatus("PM10", data.pm10)
    },
    {
      name: "O₃",
      value: data.o3,
      unit: "μg/m³",
      description: "Ozone",
      status: getPollutantStatus("O₃", data.o3)
    },
    {
      name: "NO₂",
      value: data.no2,
      unit: "μg/m³",
      description: "Nitrogen Dioxide",
      status: getPollutantStatus("NO₂", data.no2)
    },
    {
      name: "SO₂",
      value: data.so2,
      unit: "μg/m³",
      description: "Sulphur Dioxide",
      status: getPollutantStatus("SO₂", data.so2)
    },
    {
      name: "CO",
      value: data.co,
      unit: "μg/m³",
      description: "Carbon Monoxide",
      status: getPollutantStatus("CO", data.co)
    },
  ];

  const getStatusDot = (status: string) => {
    if (status === "unhealthy") return "bg-[#FD6E6E]";
    if (status === "moderate") return "bg-[#FFCA59]";
    return "bg-[#B2F5BE]";
  };

  const getValueColor = (status: string) => {
    if (status === "unhealthy") return "text-[#FD6E6E]";
    if (status === "moderate") return "text-[#FFCA59]";
    return "text-[#B2F5BE]";
  };

  return (
    <Card className="h-full bg-pollutants rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-pollutants-foreground">
          Air Pollutants
        </CardTitle>
        <p className="text-sm text-pollutants-foreground/80">
          Current pollutant levels in your area
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {pollutants.map((pollutant, index) => (
          <div key={index} className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusDot(pollutant.status)}`} />
                <div>
                  <div className="font-medium text-pollutants-foreground text-sm">
                    {pollutant.name}
                  </div>
                  <div className="text-xs text-pollutants-foreground/70">
                    {pollutant.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-pollutants-foreground">
                  {pollutant.value}
                </div>
                <div className="text-xs text-pollutants-foreground/70">
                  {pollutant.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PollutionUnits;