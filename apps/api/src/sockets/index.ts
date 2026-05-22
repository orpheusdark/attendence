import type { Server } from 'socket.io';
import { registerAttendanceSocket } from './attendance.socket.js';
import { setSocketServer } from './hub.js';

export function registerSockets(io: Server) {
  setSocketServer(io);
  registerAttendanceSocket(io);
}