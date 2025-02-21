import express from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('BATTLESHIP.');
});


export default app;