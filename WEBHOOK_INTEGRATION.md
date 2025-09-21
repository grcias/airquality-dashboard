# Make Webhook Integration

This application now integrates with your Make webhook to fetch real-time air quality and weather data for cities.

## 🔄 How It Works

### 1. City Search & Data Loading
- Both city search and data loading use the same webhook endpoint
- On Enter key press, a POST request is sent to your Make webhook
- The webhook returns city data including coordinates, AQI, and weather
- The same endpoint handles initial data loading for the current city
- The map automatically updates with the new location
- The AQI card displays real-time data

### 2. Webhook Endpoint
```
POST https://hook.eu2.make.com/f3wk4bwskt9i8vdaoamw7ht5utpltjpx
```

### 3. Request Body
```json
{
  "city": "Jakarta"
}
```

### 4. Expected Response Format
```json
{
  "success": true,
  "city": "Jakarta",
  "country": "Indonesia",
  "coords": {
    "lat": "-6.1754049",
    "lon": "106.8271680"
  },
  "aqi": 77,
  "weather": {
    "temp": 29,
    "humidity": 76,
    "wind": 0.8
  }
}
```

## Features

### ✅ What's Working
- **Real-time city search** via Make webhook
- **Interactive map** with React-Leaflet
- **Dynamic AQI card** with category-based colors
- **Weather information** display
- **Loading states** and error handling
- **Local storage** for last searched city

### 🔄 What Updates Automatically
- Map marker position
- AQI number and category
- City name and country
- Temperature, humidity, and wind speed
- AQI color coding (Good, Moderate, Unhealthy, etc.)

### 📍 Map Integration
- Uses OpenStreetMap tiles
- Automatically centers on searched city
- Shows marker with city information popup
- Updates coordinates from webhook response

## Error Handling

The application includes comprehensive error handling:
- Network request failures
- Invalid webhook responses
- Missing required data fields
- User-friendly error messages

## Console Logging

For debugging, the integration includes console logs:
- City search requests
- Webhook responses
- Processed city data
- Any errors that occur

## Future Enhancements

The integration is designed to easily support:
- Additional pollutant data (PM2.5, PM10, O3, etc.)
- Historical data from webhook
- Forecast data from webhook
- Multiple city support
- Real-time updates

## Testing

To test the integration:
1. Type a city name in the search bar
2. Press Enter
3. Watch the console for request/response logs
4. Verify the map and AQI card update
5. Check that the data persists in localStorage
