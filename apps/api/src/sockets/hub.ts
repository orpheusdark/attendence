import type { Server } from 'socket.io';

let socketServer: Server | null = null;

export function setSocketServer(server: Server) {
  socketServer = server;
}

export function getSocketServer() {
  return socketServer;
}

export function emitSessionEvent(event: string, payload: Record<string, unknown>) {
  socketServer?.emit(event, payload);
  if (payload.sessionId) {
    socketServer?.to(`session:${String(payload.sessionId)}`).emit(event, payload);
  }
}