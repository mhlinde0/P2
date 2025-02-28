import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const staticRoutes = Router();

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your routes
staticRoutes.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'index.html'));
});

staticRoutes.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'login.html'));
});

staticRoutes.get('/register', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'register.html'));
});

staticRoutes.get('/joinGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'joinGame.html'));
});

staticRoutes.get('/createGame', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'createGame.html'));
});

staticRoutes.get('/profile', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'profile.html'));
});

staticRoutes.get('/settings', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'settings.html'));
});

staticRoutes.get('/game:id', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'templates', 'game.html'));
});

export default staticRoutes;