import express from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('P2!!!');
});


export default app;