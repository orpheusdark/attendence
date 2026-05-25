const io = require('socket.io-client');
const url = process.env.SOCKET_URL || 'http://localhost:4000';
const s = io(url, { transports: ['websocket'], reconnectionDelayMax: 10000 });
console.log('connecting to', url);
s.on('connect', () => console.log('CONNECTED', s.id));
s.on('disconnect', (reason) => console.log('DISCONNECTED', reason));
s.on('session.created', (d) => console.log('EVENT session.created', JSON.stringify(d)));
s.on('attendance.scan', (d) => console.log('EVENT attendance.scan', JSON.stringify(d)));
// API emits namespaced events
s.on('attendance:session.started', (d) => console.log('EVENT attendance:session.started', JSON.stringify(d)));
s.on('attendance:scan.created', (d) => console.log('EVENT attendance:scan.created', JSON.stringify(d)));
s.on('attendance:confirmed', (d) => console.log('EVENT attendance:confirmed', JSON.stringify(d)));
s.on('connect_error', (e) => console.error('CONNECT_ERROR', e && e.message));
setInterval(() => {}, 1e6);
