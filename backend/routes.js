import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your routes
router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'frontend', 'templates', 'index.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(join(__dirname, '..', 'frontend', 'templates', 'login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(join(__dirname, '..', 'frontend', 'templates', 'register.html'));
});

export default router;