import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket() {
  if (socket) {
    return socket;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';
  const base = import.meta.env.VITE_SOCKET_URL ?? baseURL.replace(/\/api\/v1\/?$/, '');
  socket = io(base, { transports: ['websocket'] });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
