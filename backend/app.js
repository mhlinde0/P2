import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import staticRoutes from './routes/staticRoutes.js';
import userRoutes from './routes/api/userRoutes.js';
import setupWebhooks from './webhooks.js';

const app = express();

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware before routes
app.use(express.static(join(__dirname, '..', 'frontend')));
app.use(express.json());

// Register routes
app.use(staticRoutes);
app.use("/routes/api/userRoutes",userRoutes);

// Initialize webhooks AFTER app is created
setupWebhooks(app);

// 404 handler should come last
app.use((req, res) => {
    res.status(404).send("Page not found");
});

export default app;