import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});

/*import { Server } from 'socket.io';

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // Add your game logic here
});*/