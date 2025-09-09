export interface AirQualityStation {
  city: string;
  state: string;
  country: string;
  location: {
    coordinates: [number, number];
  };
  current: {
    pollution: {
      ts: string;
      aqius: number;
      mainus: string;
      aqicn: number;
      maincn: string;
    };
    weather: {
      ts: string;
      tp: number;
      pr: number;
      hu: number;
      ws: number;
      wd: number;
      ic: string;
    };
  };
}

export interface PollutionData {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface ForecastData {
  ts: string;
  aqius: number;
  aqicn: number;
}

export interface AirQualityLevel {
  level: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  description: string;
}

export const getAQILevel = (aqi: number): AirQualityLevel => {
  if (aqi <= 50) {
    return {
      level: 'Good',
      color: 'hsl(var(--status-good))',
      description: 'Air quality is considered satisfactory'
    };
  } else if (aqi <= 100) {
    return {
      level: 'Moderate',
      color: 'hsl(var(--status-moderate))',
      description: 'Air quality is acceptable for most people'
    };
  } else if (aqi <= 150) {
    return {
      level: 'Unhealthy for Sensitive Groups',
      color: 'hsl(var(--status-unhealthy))',
      description: 'Sensitive groups may experience health effects'
    };
  } else if (aqi <= 200) {
    return {
      level: 'Unhealthy',
      color: 'hsl(var(--status-unhealthy))',
      description: 'Everyone may begin to experience health effects'
    };
  } else if (aqi <= 300) {
    return {
      level: 'Very Unhealthy',
      color: 'hsl(var(--status-hazardous))',
      description: 'Health warnings of emergency conditions'
    };
  } else {
    return {
      level: 'Hazardous',
      color: 'hsl(var(--status-hazardous))',
      description: 'Health alert: everyone may experience serious health effects'
    };
  }
};