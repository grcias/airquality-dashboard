# Webhook Integration Debugging Guide

## 🚨 Current Issue
The search is failing with "Failed to fetch city data. Please try another city name."

## 🔍 Debugging Steps

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try searching for a city (e.g., "Jakarta")
4. Look for detailed error logs

### Step 2: Test Webhook Directly
1. Copy the test script from `test-webhook.js`
2. Paste it into your browser console
3. Run `testWebhook()` to test the webhook directly
4. Check the response status and data

### Step 3: Enable Fallback Mode
1. Check the "Enable Fallback Mode (Mock Data)" checkbox in the debug panel
2. Try searching for cities again
3. This will use mock data while you debug the webhook

### Step 4: Common Issues & Solutions

#### Issue 1: CORS Error
**Symptoms:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
**Solution:** Your Make webhook needs to allow CORS requests from your domain

#### Issue 2: 404 Not Found
**Symptoms:** `HTTP error! status: 404`
**Solution:** Check if the webhook URL is correct and active

#### Issue 3: 500 Server Error
**Symptoms:** `HTTP error! status: 500`
**Solution:** Your Make automation has an error - check the Make dashboard

#### Issue 4: Invalid Response Format
**Symptoms:** `Invalid data structure received from webhook`
**Solution:** The webhook response doesn't match the expected format

## 🧪 Testing the Webhook

### Expected Response Format
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

### Test Cities
Try these cities that should work:
- Jakarta
- London
- New York
- Tokyo
- Paris
- Sydney

## 🔧 Make Webhook Setup

### 1. Check Webhook URL
- Go to your Make scenario
- Find the webhook module
- Copy the webhook URL: `https://hook.eu2.make.com/f3wk4bwskt9i8vdaoamw7ht5utpltjpx`
- This single webhook handles both load data and search city operations

### 2. Check Make Automation
- Log into your Make account
- Find the automation connected to this webhook
- Check for any error messages
- Verify the automation is running

### 3. Test Webhook in Make
- Use Make's webhook testing feature
- Send a test request with: `{"city": "Jakarta"}`
- Check the response

## 📱 UI Testing with Fallback

### Enable Mock Data Mode
1. Check the "Enable Fallback Mode (Mock Data)" checkbox
2. Search for any city name
3. The app will use mock data instead of calling the webhook
4. This lets you test the UI while fixing the webhook

### Mock Data Features
- ✅ Interactive map updates
- ✅ AQI card updates
- ✅ Weather information
- ✅ Category-based colors
- ✅ Local storage persistence

## 🐛 Console Logs to Look For

### Successful Request
```
Starting search for city: Jakarta
Fetching data for city: Jakarta
Webhook URL: https://hook.eu2.make.com/...
Request body: {city: "Jakarta"}
Response status: 200
Webhook response: {success: true, city: "Jakarta", ...}
Processed city data: {name: "Jakarta", ...}
Search completed successfully
```

### Failed Request
```
Starting search for city: Jakarta
Fetching data for city: Jakarta
Webhook URL: https://hook.eu2.make.com/...
Request body: {city: "Jakarta"}
Response status: 404
Response error text: Not Found
Error fetching data from webhook: Error: HTTP error! status: 404 - Not Found
Search failed: Error: HTTP error! status: 404 - Not Found
```

## 🚀 Next Steps

1. **Check the console logs** for specific error details
2. **Test the webhook directly** using the test script
3. **Enable fallback mode** to test the UI
4. **Check your Make automation** for errors
5. **Verify the webhook URL** is correct and active

## 📞 Need Help?

If you're still having issues:
1. Share the console logs
2. Share the webhook test results
3. Check if the Make automation is working
4. Verify the webhook URL is accessible
