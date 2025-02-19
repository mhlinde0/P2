import express from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('Velkommen til vores seje battleship sænke slagskibe type beat.');
});


export default app;