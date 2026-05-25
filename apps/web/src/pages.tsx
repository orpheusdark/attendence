import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ClipboardList, Download, Lock, RefreshCw, WifiOff } from 'lucide-react';
import { login, getAnalyticsOverview, getAuditLogs, getDepartmentComparison, getHealth, getLiveSummary, getNotifications, getSessions, getAttendanceMomentum, getFraudHeatmap, startSession, scanAttendance, confirmAttendance } from './lib/api';
import { connectSocket, disconnectSocket, joinSessionRoom, leaveSessionRoom } from './lib/socket';
import { useSessionStore } from './store/session';
import { Card, LiveDot, MetricCard, PageTransition, SectionHeader, StatusPill } from './components/ui';
import type { AnalyticsOverview, AttendanceSessionDto, DepartmentComparisonRow, LiveSummary, LoginResponse, NotificationDto } from '@attendance/shared';

type MomentumPoint = { _id: { day: number }; confirmed: number; flagged: number };
type HeatmapPoint = { _id: { reason: string; status: string }; count: number; averageRisk: number };
type AuditLogRow = { _id: string; action: string; entityType: string; severity: string; createdAt: string; metadata: Record<string, unknown> };
type HealthSummary = { status: string; devices: number; audits: number };
type LoginPayload = { email: string; password: string; deviceId: string };

const gradient = ['#22d3ee', '#38bdf8', '#60a5fa', '#818cf8'];

function LoginPage() {
  const setUser = useSessionStore(state => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: data => setUser(data.user)
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email, password, deviceId: 'web-device-001' });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.2fr_0.8fr] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_40%),linear-gradient(180deg,#0b0f17_0%,#111827_55%,#0f172a_100%)] text-white">
      <div className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div>
            <div className="text-xs uppercase tracking-[0.38em] text-cyan-300/70">secure attendance system</div>
            <h1 className="mt-5 max-w-2xl text-6xl font-semibold leading-tight">Operational attendance infrastructure for serious institutions.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">Rolling QR, BLE confirmation, geofence intelligence, and fraud scoring wrapped in a modern control surface.</p>
          </div>
          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {['live qr sessions', 'reverse verification', 'department analytics'].map(item => (
              <Card key={item} className="p-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">feature</div>
                <div className="mt-3 text-lg font-medium text-white">{item}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">login</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">secure access</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              <LiveDot />
              online
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">email</div>
              <input className="w-full rounded-2xl border border-white/10 bg-[#0b0f17] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40" value={email} onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} placeholder="name@institution.edu" />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">password</div>
              <input type="password" className="w-full rounded-2xl border border-white/10 bg-[#0b0f17] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40" value={password} onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} placeholder="••••••••" />
            </label>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:scale-[1.01] disabled:opacity-60" disabled={mutation.isPending}>
              {mutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              sign in
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function OverviewHero() {
  const { data } = useQuery<AnalyticsOverview>({ queryKey: ['analytics-overview'], queryFn: getAnalyticsOverview });
  const live = data?.live;
  const statusRows = [
    ['qr rotation', '25s refresh cycle', 'active'],
    ['geofence', 'dynamic radius enforced', 'confirmed'],
    ['ble beacon', 'signal ready', 'ready'],
    ['audit trail', 'immutable events captured', 'ok']
  ] as const;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
      <Card className="relative overflow-hidden p-6 sm:p-7">
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.12),_transparent_30%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">attendance active</div>
              <div className="mt-2 text-4xl font-semibold text-white md:text-5xl">Operating Systems</div>
              <div className="mt-3 text-sm text-slate-300">Room B204 · expires in 00:18</div>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-[#0b0f17] text-xs text-cyan-100">live</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="confirmed" value={String(live?.confirmed ?? 0)} delta="live" tone="success" />
            <MetricCard label="active classes" value={String(live?.activeSessions ?? 0)} delta="now" />
            <MetricCard label="suspicious attempts" value={String(live?.flagged ?? 0)} delta="watch" tone="danger" />
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <SectionHeader eyebrow="session pulse" title="realtime operating state" />
        <div className="mt-6 space-y-4">
          {statusRows.map(([label, detail, status]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-slate-400">{detail}</div>
              </div>
              <StatusPill status={status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AnalyticsBlock() {
  const momentum = useQuery<MomentumPoint[]>({ queryKey: ['attendance-momentum'], queryFn: getAttendanceMomentum });
  const comparison = useQuery<DepartmentComparisonRow[]>({ queryKey: ['department-comparison'], queryFn: getDepartmentComparison });
  const heatmap = useQuery<HeatmapPoint[]>({ queryKey: ['fraud-heatmap'], queryFn: getFraudHeatmap });

  const lineData = momentum.data?.map(point => ({ day: `day ${point._id.day}`, confirmed: point.confirmed, flagged: point.flagged })) ?? [];
  const departmentData = comparison.data ?? [];
  const heatmapData = heatmap.data ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="p-6">
        <SectionHeader eyebrow="attendance momentum" title="department movement" />
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0b0f17', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
              <Line type="monotone" dataKey="confirmed" stroke="#22d3ee" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="flagged" stroke="#fb7185" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeader eyebrow="fraud heatmap" title="proxy pressure" />
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatmapData.slice(0, 6)} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="_id.reason" type="category" width={120} stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0b0f17', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
              <Bar dataKey="count" radius={[0, 12, 12, 0]}>
                {heatmapData.slice(0, 6).map((entry, index) => (
                  <Cell key={entry._id.reason} fill={gradient[index % gradient.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 xl:col-span-2">
        <SectionHeader eyebrow="department rankings" title="institution standings" />
        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
          <div className="grid grid-cols-5 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
            <div>department</div>
            <div className="text-right">sessions</div>
            <div className="text-right">attendance</div>
            <div className="text-right">confirmed</div>
            <div className="text-right">rate</div>
          </div>
          <div className="divide-y divide-white/10">
            {departmentData.map((row, index) => (
              <div key={row.departmentId ?? index} className="grid grid-cols-5 items-center px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5">
                <div className="font-medium text-white">{row.departmentId ?? 'unassigned'}</div>
                <div className="text-right text-slate-300">{row.sessions}</div>
                <div className="text-right text-slate-300">{row.attendanceCount}</div>
                <div className="text-right text-slate-300">{row.confirmedCount}</div>
                <div className="text-right text-emerald-200">{row.confirmedRate.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TeacherPage() {
  const sessions = useQuery<AttendanceSessionDto[]>({ queryKey: ['sessions'], queryFn: getSessions });
  const live = useQuery<LiveSummary>({ queryKey: ['live-summary'], queryFn: getLiveSummary });

  useEffect(() => {
    const list = sessions.data ?? [];
    if (list.length === 0) {
      return;
    }

    connectSocket();
    for (const session of list) {
      joinSessionRoom(session._id);
    }

    return () => {
      for (const session of list) {
        leaveSessionRoom(session._id);
      }
      disconnectSocket();
    };
  }, [sessions.data]);

  return (
    <PageTransition>
      <div className="space-y-6">
        <SectionHeader eyebrow="teacher console" title="realtime session control" action={<div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"><LiveDot /> live feed</div>} />
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">rolling qr</div>
                  <div className="mt-3 text-4xl font-semibold text-white">00:18</div>
                  <div className="mt-1 text-sm text-slate-300">expires in 18 seconds</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['session status', 'active'],
                    ['beacon', 'paired'],
                    ['reverse qr', 'armed'],
                    ['sync', 'online']
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
                      <div className="mt-2 text-lg text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm text-slate-400">live attendance feed</div>
                <div className="space-y-3">
                  {['student a confirmed', 'student b pending reverse qr', 'fraud alert: mock location blocked', 'student c confirmed via BLE'].map(item => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      <span>{item}</span>
                      <span className="text-xs text-cyan-200">now</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader eyebrow="quick stats" title="session telemetry" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricCard label="active" value={String(live.data?.activeSessions ?? 0)} delta="sessions" />
              <MetricCard label="confirmed" value={String(live.data?.confirmed ?? 0)} delta="students" tone="success" />
              <MetricCard label="flagged" value={String(live.data?.flagged ?? 0)} delta="alerts" tone="danger" />
              <MetricCard label="fraud" value={String(live.data?.openFraud ?? 0)} delta="open" tone="danger" />
            </div>
          </Card>
        </div>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">recent sessions</div>
            <StatusPill status="active" />
          </div>
          <div className="mt-4 space-y-3">
            {(sessions.data ?? []).map(session => (
              <div key={session._id} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:grid-cols-[1.5fr_0.8fr_0.6fr_0.6fr] md:items-center">
                <div>
                  <div className="font-medium text-white">{session.classroomName}</div>
                  <div className="text-xs text-slate-400">session {session._id.slice(-6)}</div>
                </div>
                <div className="text-sm text-slate-300">confirmed {session.confirmedCount}</div>
                <div className="text-sm text-slate-300">attendance {session.attendanceCount}</div>
                <div className="flex justify-start md:justify-end"><StatusPill status={session.status} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

function HodPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <SectionHeader eyebrow="hod analytics" title="department intelligence" />
        <OverviewHero />
        <AnalyticsBlock />
      </div>
    </PageTransition>
  );
}

function AdminPage() {
  const health = useQuery<HealthSummary>({ queryKey: ['health'], queryFn: getHealth });
  const sessions = useQuery<AttendanceSessionDto[]>({ queryKey: ['sessions'], queryFn: getSessions });
  const [subjectId, setSubjectId] = useState('6a139efb0eecf3a380990c66');
  const [classroom, setClassroom] = useState('TEST-R101');
  const [sessionId, setSessionId] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [studentId, setStudentId] = useState('');
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [resultLog, setResultLog] = useState<string[]>([]);

  useEffect(() => {
    const socket = connectSocket();
    const onStarted = (payload: { sessionId: string; qrToken: string }) => {
      setSessionId(payload.sessionId);
      setQrToken(payload.qrToken);
      joinSessionRoom(payload.sessionId);
      setEventLog(prev => [`session.started ${payload.sessionId.slice(-6)}`, ...prev].slice(0, 8));
    };
    const onScan = (payload: { studentId: string; status: string }) => {
      setEventLog(prev => [`scan.created ${payload.studentId.slice(-6)} ${payload.status}`, ...prev].slice(0, 8));
    };
    const onConfirm = (payload: { studentId: string; status: string }) => {
      setEventLog(prev => [`confirmed ${payload.studentId.slice(-6)} ${payload.status}`, ...prev].slice(0, 8));
    };

    socket.on('attendance:session.started', onStarted);
    socket.on('attendance:scan.created', onScan);
    socket.on('attendance:confirmed', onConfirm);

    return () => {
      if (sessionId) {
        leaveSessionRoom(sessionId);
      }
      socket.off('attendance:session.started', onStarted);
      socket.off('attendance:scan.created', onScan);
      socket.off('attendance:confirmed', onConfirm);
      disconnectSocket();
    };
  }, [sessionId]);

  const startNewSession = async () => {
    try {
      const response = await startSession({ subjectId, classroomName: classroom });
      setSessionId(response.session._id);
      setQrToken(response.qr.token);
      setResultLog(prev => [`started session ${response.session._id}`, ...prev].slice(0, 8));
      sessions.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'start session failed';
      setResultLog(prev => [`error: ${message}`, ...prev].slice(0, 8));
    }
  };

  const runScan = async () => {
    if (!sessionId || !qrToken) {
      setResultLog(prev => ['error: create or select a session first', ...prev].slice(0, 8));
      return;
    }

    const id = studentId || Math.random().toString(16).slice(2, 26).padEnd(24, '0').slice(0, 24);
    setStudentId(id);

    try {
      await scanAttendance({
        sessionId,
        studentId: id,
        deviceId: 'web-test-device-001',
        deviceFingerprintHash: 'web-test-fp',
        ipAddress: '127.0.0.1',
        latitude: 0,
        longitude: 0,
        qrToken
      });
      setResultLog(prev => [`scan ok for ${id}`, ...prev].slice(0, 8));
      sessions.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'scan failed';
      setResultLog(prev => [`error: ${message}`, ...prev].slice(0, 8));
    }
  };

  const runConfirm = async () => {
    if (!sessionId || !studentId) {
      setResultLog(prev => ['error: run scan first', ...prev].slice(0, 8));
      return;
    }

    try {
      await confirmAttendance({ sessionId, studentId, reverseToken: `reverse-${Date.now()}`, confirmationMethod: 'manual' });
      setResultLog(prev => [`confirm ok for ${studentId}`, ...prev].slice(0, 8));
      sessions.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'confirm failed';
      setResultLog(prev => [`error: ${message}`, ...prev].slice(0, 8));
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <SectionHeader eyebrow="test center" title="quick end-to-end testing" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricCard label="api" value={health.data?.status ?? 'checking'} delta="/health" tone={health.data?.status === 'ok' ? 'success' : 'danger'} />
            <MetricCard label="sessions" value={String(sessions.data?.length ?? 0)} delta="loaded" />
            <MetricCard label="active id" value={sessionId ? sessionId.slice(-6) : 'none'} delta="current" />
          </div>
          <div className="mt-4 text-sm text-slate-300">Use the 3 buttons in order: start session, run scan, confirm attendance. You should see socket events immediately in the live feed.</div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <SectionHeader eyebrow="step 1" title="start a session" />
            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">subject id</div>
                <input value={subjectId} onChange={(event: ChangeEvent<HTMLInputElement>) => setSubjectId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0f17] px-3 py-2 text-sm text-white" />
              </label>
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">classroom</div>
                <input value={classroom} onChange={(event: ChangeEvent<HTMLInputElement>) => setClassroom(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0f17] px-3 py-2 text-sm text-white" />
              </label>
              <button onClick={startNewSession} className="w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950">Start Session</button>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <SectionHeader eyebrow="steps 2 & 3" title="scan and confirm" />
            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">session id</div>
                <select value={sessionId} onChange={(event: ChangeEvent<HTMLSelectElement>) => setSessionId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0f17] px-3 py-2 text-sm text-white">
                  <option value="">Select session</option>
                  {(sessions.data ?? []).map(item => (
                    <option key={item._id} value={item._id}>{item.classroomName} · {item._id.slice(-6)}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">qr token (auto from start)</div>
                <input value={qrToken} onChange={(event: ChangeEvent<HTMLInputElement>) => setQrToken(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0f17] px-3 py-2 text-sm text-white" />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <button onClick={runScan} className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Run Scan</button>
                <button onClick={runConfirm} className="rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-100">Confirm</button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <SectionHeader eyebrow="realtime" title="socket event feed" />
            <div className="mt-4 space-y-2">
              {eventLog.length === 0 ? <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">No events yet.</div> : null}
              {eventLog.map((line, index) => (
                <div key={`${line}-${index}`} className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">{line}</div>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <SectionHeader eyebrow="requests" title="action results" />
            <div className="mt-4 space-y-2">
              {resultLog.length === 0 ? <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">No actions run yet.</div> : null}
              {resultLog.map((line, index) => (
                <div key={`${line}-${index}`} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{line}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

function SessionPage() {
  const sessions = useQuery<AttendanceSessionDto[]>({ queryKey: ['sessions'], queryFn: getSessions });
  return (
    <PageTransition>
      <div className="space-y-6">
        <SectionHeader eyebrow="attendance sessions" title="live session index" action={<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"><Download className="h-3.5 w-3.5" /> export</div>} />
        <Card className="overflow-hidden">
          <div className="grid grid-cols-5 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">
            <div>classroom</div>
            <div>status</div>
            <div className="text-right">attendance</div>
            <div className="text-right">confirmed</div>
            <div className="text-right">timer</div>
          </div>
          <div className="divide-y divide-white/10">
            {(sessions.data ?? []).map(session => (
              <div key={session._id} className="grid grid-cols-5 px-4 py-4 text-sm text-slate-300 transition hover:bg-white/5">
                <div className="font-medium text-white">{session.classroomName}</div>
                <div><StatusPill status={session.status} /></div>
                <div className="text-right">{session.attendanceCount}</div>
                <div className="text-right">{session.confirmedCount}</div>
                <div className="text-right text-cyan-200">{new Date(session.qrExpiresAt).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

function LogsPage() {
  const logs = useQuery<AuditLogRow[]>({ queryKey: ['audit-logs'], queryFn: getAuditLogs });
  return (
    <PageTransition>
      <div className="space-y-6">
        <SectionHeader eyebrow="audit logs" title="event history" />
        <div className="grid gap-4 xl:grid-cols-2">
          {(logs.data ?? []).map(log => (
            <Card key={log._id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-white">{log.action}</div>
                <StatusPill status={log.severity === 'critical' ? 'flagged' : log.severity === 'high' ? 'pending' : 'confirmed'} />
              </div>
              <div className="mt-2 text-xs text-slate-400">{log.entityType} · {new Date(log.createdAt).toLocaleString()}</div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function SettingsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <SectionHeader eyebrow="settings" title="security and realtime policies" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['qr refresh', '25 seconds'],
            ['geofence radius', 'dynamic by classroom'],
            ['duplicate scan guard', 'enabled'],
            ['device session tracking', 'enabled'],
            ['push notifications', 'socket + email'],
            ['offline sync', 'queued with conflict resolution']
          ].map(([label, value]) => (
            <Card key={label} className="p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</div>
              <div className="mt-3 text-lg text-white">{value}</div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

function ReportsPage() {
  const barData = [
    { label: 'Jan', value: 78 },
    { label: 'Feb', value: 84 },
    { label: 'Mar', value: 91 },
    { label: 'Apr', value: 88 },
    { label: 'May', value: 93 }
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <SectionHeader eyebrow="reports" title="export center" action={<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"><ClipboardList className="h-3.5 w-3.5" /> pdf / xlsx / csv</div>} />
        <Card className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={barData}>
                <defs>
                  <linearGradient id="reportGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0b0f17', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                <Area dataKey="value" stroke="#22d3ee" fill="url(#reportGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200"><WifiOff className="h-6 w-6" /></div>
        <div className="mt-5 text-2xl font-semibold text-white">page unavailable</div>
        <div className="mt-2 text-sm text-slate-400">The control surface is still loaded, but that route is not exposed yet.</div>
      </Card>
    </div>
  );
}

export const pages = {
  login: <LoginPage />,
  admin: <AdminPage />,
  teacher: <TeacherPage />,
  hod: <HodPage />,
  sessions: <SessionPage />,
  logs: <LogsPage />,
  settings: <SettingsPage />,
  reports: <ReportsPage />,
  notFound: <NotFoundPage />
};
