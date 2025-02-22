import express from 'express';
import setupWebhooks from './webhooks.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('ser du dette virker lortet');
});

// Initialize webhooks AFTER app is created
setupWebhooks(app);

export default app;