import type { Server } from 'socket.io';

declare global {
  namespace Express {
    interface Request {
      io: Server;
      connectedUsers: Record<string, string>;
    }
  }

  interface IncomingHttpHeaders {
    user_id?: string;
  }
}

export {};
