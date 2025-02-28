#!/bin/sh
cd /home/jakob/Desktop/P2

sudo git pull

sudo npm install

sudo pm2 stop backend/server.js

sudo pm2 start backend/server.js

