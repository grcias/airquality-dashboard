// Test script for the Make webhook
// Run this in your browser console to test the webhook directly

async function testWebhook() {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://hook.eu2.make.com/detov4ly3w3fi43boq9sh5f6snh53qhi';
  
  console.log('Testing webhook...');
  console.log('URL:', webhookUrl);
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: 'Jakarta' })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Response data:', data);
      
      // Validate the response structure
      const requiredFields = ['success', 'city', 'country', 'coords', 'aqi', 'weather'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        console.warn('⚠️ Missing required fields:', missingFields);
      } else {
        console.log('✅ All required fields present');
      }
      
    } else {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

// Test with different cities
async function testMultipleCities() {
  const cities = ['Jakarta', 'London', 'New York', 'Tokyo'];
  
  for (const city of cities) {
    console.log(`\n--- Testing city: ${city} ---`);
    await testWebhook(city);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
  }
}

// Run the test
console.log('Webhook test script loaded. Run testWebhook() or testMultipleCities() to test.');
