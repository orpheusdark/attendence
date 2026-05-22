import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) {
    return socket;
  }

  const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';
  const base = baseURL.replace(/\/api\/v1\/?$/, '');
  socket = io(base, { transports: ['websocket'] });
  return socket;
}

export function closeSocket() {
  socket?.disconnect();
  socket = null;
}
