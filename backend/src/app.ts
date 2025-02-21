import express from 'express';


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('En eller anden tekst her som viser at det virker!!!');
});



export default app;