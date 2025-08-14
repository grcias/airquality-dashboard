import axios from 'axios';

// IQAir API configuration
const API_BASE_URL = 'https://api.airvisual.com/v2';

// Note: In production, you'd store this securely
// For demo purposes, we'll use mock data
export class AirQualityAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'demo_key';
  }

  // Get nearest city air quality data
  async getNearestCityData(lat?: number, lon?: number) {
    try {
      // In production, uncomment this for real API calls:
      // const response = await axios.get(
      //   `${API_BASE_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${this.apiKey}`
      // );
      // return response.data;
      
      // Mock data for demo
      return {
        status: "success",
        data: {
          city: "Los Angeles",
          state: "California", 
          country: "USA",
          location: {
            coordinates: [-118.2437, 34.0522]
          },
          current: {
            pollution: {
              ts: new Date().toISOString(),
              aqius: 85,
              mainus: "p2",
              aqicn: 58,
              maincn: "p2"
            },
            weather: {
              ts: new Date().toISOString(),
              tp: 22,
              pr: 1013,
              hu: 65,
              ws: 3.6,
              wd: 270,
              ic: "01d"
            }
          }
        }
      };
    } catch (error) {
      console.error('Error fetching nearest city data:', error);
      throw error;
    }
  }

  // Get specific city air quality data
  async getCityData(city: string, state: string, country: string) {
    try {
      // Mock data for demo
      const cities = [
        { city: "New York", state: "New York", country: "USA", aqi: 42, lat: 40.7128, lng: -74.0060 },
        { city: "Los Angeles", state: "California", country: "USA", aqi: 85, lat: 34.0522, lng: -118.2437 },
        { city: "Chicago", state: "Illinois", country: "USA", aqi: 63, lat: 41.8781, lng: -87.6298 },
        { city: "Houston", state: "Texas", country: "USA", aqi: 71, lat: 29.7604, lng: -95.3698 },
        { city: "Phoenix", state: "Arizona", country: "USA", aqi: 95, lat: 33.4484, lng: -112.0740 },
      ];
      
      return cities.find(c => c.city === city) || cities[0];
    } catch (error) {
      console.error('Error fetching city data:', error);
      throw error;
    }
  }

  // Get multiple cities data for stations display
  async getMultipleCitiesData() {
    try {
      // Mock data for multiple stations
      return [
        { city: "New York", country: "USA", aqi: 42, lat: 40.7128, lng: -74.0060 },
        { city: "Los Angeles", country: "USA", aqi: 85, lat: 34.0522, lng: -118.2437 },
        { city: "Chicago", country: "USA", aqi: 63, lat: 41.8781, lng: -87.6298 },
        { city: "Houston", country: "USA", aqi: 71, lat: 29.7604, lng: -95.3698 },
        { city: "Phoenix", country: "USA", aqi: 95, lat: 33.4484, lng: -112.0740 },
        { city: "Philadelphia", country: "USA", aqi: 58, lat: 39.9526, lng: -75.1652 },
        { city: "San Antonio", country: "USA", aqi: 76, lat: 29.4241, lng: -98.4936 },
        { city: "San Diego", country: "USA", aqi: 69, lat: 32.7157, lng: -117.1611 },
      ];
    } catch (error) {
      console.error('Error fetching multiple cities data:', error);
      throw error;
    }
  }

  // Generate mock pollution units data
  generatePollutionUnitsData() {
    return {
      pm25: 25.5 + Math.random() * 20,
      pm10: 45.2 + Math.random() * 30,
      o3: 68.7 + Math.random() * 25,
      no2: 42.1 + Math.random() * 20,
    };
  }

  // Generate mock forecast data
  generateForecastData(type: 'hourly' | 'daily') {
    if (type === 'hourly') {
      const hours = [];
      for (let i = 0; i < 6; i++) {
        const hour = new Date();
        hour.setHours(hour.getHours() + i);
        hours.push({
          time: hour.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
          aqi: 60 + Math.floor(Math.random() * 40)
        });
      }
      return hours;
    } else {
      const days = [];
      const dayNames = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
      for (let i = 0; i < 5; i++) {
        days.push({
          time: dayNames[i],
          aqi: 55 + Math.floor(Math.random() * 50)
        });
      }
      return days;
    }
  }

  // Generate mock historical data
  generateHistoricalData() {
    const data = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        aqi: 40 + Math.floor(Math.random() * 80)
      });
    }
    return data;
  }
}

// Export a default instance
export const airQualityAPI = new AirQualityAPI();