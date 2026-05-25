const io = require('socket.io-client');
const fetch = global.fetch || require('node-fetch');
const API = process.env.API_BASE || 'http://localhost:4000/api/v1';
const SUBJECT_ID = process.env.TEST_SUBJECT_ID || '6a139efb0eecf3a380990c66';

function randObjectId() {
  return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

async function post(path, token, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return { status: res.status, text }; }
}

(async () => {
  console.log('E2E: login');
  const login = await post('/auth/login', null, { email: 'admin@attendance.local', password: 'ChangeMe123!', deviceId: 'e2e-cli' });
  if (!login || !login.accessToken) { console.error('login failed', login); process.exit(1); }
  const token = login.accessToken;

  const socket = io(API.replace(/\/api\/v1\/?$/, ''), { transports: ['websocket'] });
  socket.on('connect', () => console.log('socket connected', socket.id));
  socket.on('attendance:session.started', d => console.log('socket event session.started', d));
  socket.on('attendance:scan.created', d => console.log('socket event scan.created', d));
  socket.on('attendance:confirmed', d => console.log('socket event confirmed', d));

  console.log('E2E: start session');
  const start = await post('/attendance/sessions', token, { subjectId: SUBJECT_ID, classroomName: 'E2E-Room' });
  console.log('start result', start.session ? 'ok' : start);
  const sessionId = start.session._id;
  const qr = start.qr?.token;

  // wait a moment for socket join
  await new Promise(r => setTimeout(r, 300));

  console.log('E2E: simulate scan');
  const studentId = randObjectId();
  const scan = await post('/attendance/scan', token, {
    sessionId,
    studentId,
    deviceId: 'e2e-device-001',
    deviceFingerprintHash: 'fp-e2e',
    ipAddress: '127.0.0.1',
    latitude: 0,
    longitude: 0,
    qrToken: qr
  });
  console.log('scan result', scan && scan._id ? 'ok' : scan);

  console.log('E2E: confirm attendance');
  const confirm = await post('/attendance/confirm', token, {
    sessionId,
    studentId,
    reverseToken: 'reverse-e2e',
    confirmationMethod: 'manual'
  });
  console.log('confirm result', confirm && confirm._id ? 'ok' : confirm);

  console.log('E2E complete — waiting 1s for socket events then exiting');
  await new Promise(r => setTimeout(r, 1000));
  socket.close();
  process.exit(0);
})();
