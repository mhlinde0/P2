import express from 'express';
import './webhoooks'
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send(' ikke noget vigtigt');
});

export default app;