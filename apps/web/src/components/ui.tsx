import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.28)] ${className}`}>{children}</div>;
}

export function MetricCard({ label, value, delta, tone = 'default' }: { label: string; value: string; delta?: string; tone?: 'default' | 'danger' | 'success' }) {
  const toneClass = tone === 'danger' ? 'text-red-200 bg-red-500/10' : tone === 'success' ? 'text-emerald-200 bg-emerald-500/10' : 'text-cyan-200 bg-white/10';
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold text-white">{value}</div>
        {delta ? <div className={`rounded-full px-2.5 py-1 text-xs ${toneClass}`}>{delta}</div> : null}
      </div>
    </Card>
  );
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">{eyebrow}</div>
        <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
    flagged: 'bg-red-500/10 text-red-200 border-red-500/20',
    expired: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
    open: 'bg-red-500/10 text-red-200 border-red-500/20',
    active: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20',
    ok: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
    ready: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20'
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${styles[status] ?? styles.expired}`}>{status}</span>;
}

export function LiveDot() {
  return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.12)]" />;
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
