import { Bell, Grid2x2, Shield, ScanLine, Settings2, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Card, LiveDot } from './ui';
import { useSessionStore } from '../store/session';

const navItems = [
  { to: '/', label: 'Test Lab', icon: Grid2x2 },
  { to: '/teacher', label: 'Teacher', icon: ScanLine },
  { to: '/hod', label: 'HOD', icon: Users },
  { to: '/sessions', label: 'Sessions', icon: Shield },
  { to: '/logs', label: 'Audit', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings2 }
];

export function Shell({ children }: { children: ReactNode }) {
  const user = useSessionStore(state => state.user);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.12),_transparent_35%),linear-gradient(180deg,#0b0f17_0%,#111827_55%,#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[290px] shrink-0 border-r border-white/10 bg-[#0b0f17]/80 px-6 py-6 backdrop-blur-xl xl:flex xl:flex-col">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl border border-cyan-400/20 bg-cyan-400/10" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/70">secure attendance</div>
              <div className="text-lg font-semibold text-white">Operational Control</div>
            </div>
          </div>

          <nav className="mt-10 flex flex-col gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Card className="mt-auto p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">status</div>
              <LiveDot />
            </div>
            <div className="mt-4 text-sm text-slate-300">{user ? `${user.name} · ${user.role}` : 'signed out'}</div>
            <div className="mt-1 text-xs text-slate-500">rolling qr, beacon, geofence, realtime feed</div>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0f17]/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.32em] text-slate-500">quick testing mode</div>
                <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">attendance system test workspace</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 sm:flex">
                  <LiveDot />
                  realtime online
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white">
                  {user?.name?.slice(0, 1) ?? 'A'}
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
              Login: admin@attendance.local / ChangeMe123! • API: localhost:4000 • Use the Test Lab page for 1-click start, scan, confirm.
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>

          <nav className="sticky bottom-0 z-20 border-t border-white/10 bg-[#0b0f17]/80 px-3 py-3 backdrop-blur-xl xl:hidden">
            <div className="grid grid-cols-6 gap-1 text-xs text-slate-400">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
