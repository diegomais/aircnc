const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const routes = require('./routes');
const PORT = process.env.PORT || 3333;
const app = express();
const server = http.Server(app);
const io = socketio(server);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
};

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);
app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

server.listen(PORT);
