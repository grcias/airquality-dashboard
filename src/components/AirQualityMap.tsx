import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getAQILevel } from "@/types/airQuality";

interface AirQualityMapProps {
  stations: Array<{
    city: string;
    country: string;
    aqi: number;
    lat: number;
    lng: number;
  }>;
}

const AirQualityMap = ({ stations }: AirQualityMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // For now, we'll create a simple visual map representation
  // In production, you'd integrate with Leaflet or similar mapping library
  const mockStations = stations.length > 0 ? stations : [
    { city: "Los Angeles", country: "USA", aqi: 85, lat: 34.0522, lng: -118.2437 },
    { city: "New York", country: "USA", aqi: 42, lat: 40.7128, lng: -74.0060 },
    { city: "Chicago", country: "USA", aqi: 63, lat: 41.8781, lng: -87.6298 },
    { city: "Houston", country: "USA", aqi: 71, lat: 29.7604, lng: -95.3698 },
    { city: "Phoenix", country: "USA", aqi: 95, lat: 33.4484, lng: -112.0740 },
  ];

  return (
    <Card className="h-full bg-gradient-to-br from-map-section to-map-section/80 border-2 border-map-section/30 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-map-foreground flex items-center gap-3">
          <MapPin className="h-6 w-6" />
          Monitoring Stations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          ref={mapRef}
          className="relative h-64 bg-map-section/20 rounded-xl border-2 border-map-foreground/20 overflow-hidden"
        >
          {/* Mock map visualization */}
          <div className="absolute inset-0 bg-gradient-to-br from-map-foreground/5 to-map-foreground/10 flex items-center justify-center">
            <div className="text-map-foreground/60 text-sm font-medium">
              Interactive Map Loading...
            </div>
          </div>
          
          {/* Station markers */}
          {mockStations.map((station, index) => {
            const aqiLevel = getAQILevel(station.aqi);
            return (
              <div
                key={index}
                className="absolute w-4 h-4 rounded-full border-2 border-map-foreground shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer"
                style={{
                  backgroundColor: aqiLevel.color,
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                title={`${station.city}: AQI ${station.aqi}`}
              />
            );
          })}
        </div>
        
        {/* Station list */}
        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
          {mockStations.map((station, index) => {
            const aqiLevel = getAQILevel(station.aqi);
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-map-foreground/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: aqiLevel.color }}
                  />
                  <span className="text-map-foreground font-medium text-sm">
                    {station.city}
                  </span>
                </div>
                <span className="text-map-foreground font-bold text-sm">
                  {station.aqi}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityMap;