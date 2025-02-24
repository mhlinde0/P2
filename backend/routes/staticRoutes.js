import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const staticRoutes = Router();

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your routes
staticRoutes.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'index.html'));
});

staticRoutes.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'login.html'));
});

staticRoutes.get('/register', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'register.html'));
});

staticRoutes.get('/findGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'findGame.html'));
});

staticRoutes.get('/createGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'createGame.html'));
});


export default staticRoutes;