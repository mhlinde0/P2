import express from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('Velkommen til vores ultra mega seje battleship sænke slagskibe type beat spil game.');
});


export default app;