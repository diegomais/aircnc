const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(
  'mongodb+srv://aircnc:Ewky4oDdrrWp2mVC@aircnc-d8eag.mongodb.net/aircnc?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const connectedUsers = {};

io.on('connection', socket => {
  // Get user_id sent by client
  const { user_id } = socket.handshake.query;

  // Store socket_id by user_id.
  // In production, it's recommended to use Redis to persist data when server is down.
  connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
  // Attach the io instance to request, then we can access it via the request.
  req.io = io;

  // Attach the connectedUsers to request, then we can access them via the request.
  req.connectedUsers = connectedUsers;

  // Callback argument to the middleware function, called "next" by convention.
  return next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);
