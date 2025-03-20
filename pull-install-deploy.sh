#!/bin/sh
cd /home/jakob/Desktop/P2

sudo git pull

sudo npm install

sudo pm2 reload backend/server.js

