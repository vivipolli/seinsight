import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'demo-real.html'));
});

// Serve the demo HTML file directly
app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'demo-real.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Seinsight AI Frontend Server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to: http://localhost:${PORT}/demo`);
    console.log('Press Ctrl+C to stop the server');
});
