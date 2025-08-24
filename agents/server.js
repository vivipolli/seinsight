import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from dist/frontend
app.use(express.static(path.join(__dirname, 'dist/frontend')));

// API proxy to Eliza agent (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api', async (req, res) => {
    try {
      // For local development, proxy to local Eliza agent
      const response = await fetch(`http://localhost:3000${req.path}`, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
      });
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Eliza agent not available' });
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Seinsight AI Frontend Server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to: http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
  });
}

// For Vercel serverless
export default app;
