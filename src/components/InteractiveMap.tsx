import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletFix.css';
import L from 'leaflet';

// Mock data for air quality stations
const mockStations = [
  {
    placeName: "Jakarta Central",
    aqi: 85,
    category: "Moderate",
    mainPollutant: "PM2.5",
    lat: -6.223099,
    lng: 106.791597
  },
  {
    placeName: "Jakarta North",
    aqi: 95,
    category: "Moderate",
    mainPollutant: "PM10",
    lat: -6.213099,
    lng: 106.781597
  },
  {
    placeName: "Jakarta South",
    aqi: 110,
    category: "Unhealthy for Sensitive Groups",
    mainPollutant: "O3",
    lat: -6.233099,
    lng: 106.801597
  },
  {
    placeName: "Jakarta East",
    aqi: 75,
    category: "Moderate",
    mainPollutant: "NO2",
    lat: -6.223099,
    lng: 106.811597
  },
  {
    placeName: "Jakarta West",
    aqi: 65,
    category: "Moderate",
    mainPollutant: "PM2.5",
    lat: -6.223099,
    lng: 106.771597
  }
];

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Station {
  placeName: string;
  aqi: number;
  category: string;
  mainPollutant: string;
  lat: number;
  lng: number;
}

const InteractiveMap = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jakartaPosition: [number, number] = [-6.223099, 106.791597];

  useEffect(() => {
    // Using mock data instead of API call to avoid CORS issues
    setStations(mockStations);
    setLoading(false);
    
    // Commented out real API call for reference
    /*
    const fetchAirQualityData = async () => {
      try {
        const response = await fetch(
          'https://api.ambeedata.com/latest/by-lat-lng?lat=-6.223099&lng=106.791597',
          {
            headers: {
              'x-api-key': '1c1354403c68a3af9bf0da21b54b806edd4ad039c99838fba30967e3d058b1d6',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch air quality data');
        }

        const data = await response.json();
        setStations(data.stations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAirQualityData();
    */
  }, []);

  if (loading) {
    return <div>Loading map data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={jakartaPosition}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stations.map((station, index) => (
          <Marker
            key={index}
            position={[station.lat, station.lng]}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold mb-1">{station.placeName}</h3>
                <p>AQI: {station.aqi}</p>
                <p>Category: {station.category}</p>
                <p>Main Pollutant: {station.mainPollutant}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;