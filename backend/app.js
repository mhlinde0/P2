import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';
import setupWebhooks from './webhooks.js';

const app = express();
// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware before routes
app.use(express.static(join(__dirname, '..', 'frontend')));
app.use(express.json());
app.use(router);

// Initialize webhooks AFTER app is created
setupWebhooks(app);

export default app;