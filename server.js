import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Webhook proxy endpoint
app.post('/api/webhook', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const webhookUrl = process.env.VITE_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return res.status(500).json({ error: 'Webhook URL not configured' });
    }

    console.log(`Proxying webhook request for city: ${city}`);

    // Forward request to Make.com webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city })
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Webhook proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from webhook',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook URL: ${process.env.VITE_WEBHOOK_URL ? 'Configured' : 'Not configured'}`);
});