import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import setupWebhooks from './webhooks.js';

const app = express();
// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware before routes
app.use(express.static(join(__dirname, '..', 'frontend')));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('ser du dette virker lortet');
});

app.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '..', 'frontend', 'templates', 'login.html'));
});

// Initialize webhooks AFTER app is created
setupWebhooks(app);

export default app;