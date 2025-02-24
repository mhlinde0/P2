import connectDB from './config/db.js';    //db.js function(mongoose)
import app from './app.js';
import express from "express";

//----------------CONSTANTS----------------//
const PORT = process.env.PORT || 4000;
const userRoutes = require('./routes/userRoutes.js')
const mongoose = require('mongoose')
//----------------------------------------//



//********MiddleWare********//
app.use(express.json())
//==========================//



//**********Routes**********//
app.use('/api/userRoutes',userRoutes)
//==========================//


(async () => {
  await connectDB(); //awaits for DB connection before server start

  //request listener
  app.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`);
  });
})();



/*import { Server } from 'socket.io';

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // Add your game logic here
});*/

