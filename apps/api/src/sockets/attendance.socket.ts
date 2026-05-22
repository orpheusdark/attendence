import type { Server } from 'socket.io';

export function registerAttendanceSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('session:join', ({ sessionId }: { sessionId: string }) => {
      socket.join(`session:${sessionId}`);
    });

    socket.on('session:leave', ({ sessionId }: { sessionId: string }) => {
      socket.leave(`session:${sessionId}`);
    });
  });
}