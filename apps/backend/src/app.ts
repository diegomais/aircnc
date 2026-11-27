import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import routes from './routes';

const require = createRequire(import.meta.url);
const dotenv = require('dotenv') as { config: () => void };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
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
}

mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/aircnc');

const connectedUsers: Record<string, string> = {};

io.on('connection', (socket) => {
  // Get user_id sent by client
  const { user_id } = socket.handshake.query;

  // Store socket_id by user_id.
  // In production, it's recommended to use Redis to persist data when server is down.
  if (typeof user_id === 'string') connectedUsers[user_id] = socket.id;
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
app.get('/healthz', (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  return res
    .status(databaseReady ? 200 : 503)
    .json({ status: databaseReady ? 'ok' : 'unavailable' });
});
app.get('/debug-sentry', (_req, _res) => {
  throw new Error('My first Sentry error!');
});
app.use('/files', express.static(resolve(__dirname, '..', 'uploads')));
app.use(routes);
app.use(Sentry.Handlers.errorHandler());
app.use(((err: Error & { sentry?: string }, _req, _res, _next) => {
  _res
    .status(500)
    .end((_res as express.Response & { sentry?: string }).sentry + '\n');
}) as express.ErrorRequestHandler);

export default httpServer;
