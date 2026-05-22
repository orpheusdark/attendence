import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function Card({ children, className = '' }) {
    return _jsx("div", { className: `rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.28)] ${className}`, children: children });
}
export function MetricCard({ label, value, delta, tone = 'default' }) {
    const toneClass = tone === 'danger' ? 'text-red-200 bg-red-500/10' : tone === 'success' ? 'text-emerald-200 bg-emerald-500/10' : 'text-cyan-200 bg-white/10';
    return (_jsxs(Card, { className: "p-5", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: label }), _jsxs("div", { className: "mt-3 flex items-end justify-between gap-4", children: [_jsx("div", { className: "text-3xl font-semibold text-white", children: value }), delta ? _jsx("div", { className: `rounded-full px-2.5 py-1 text-xs ${toneClass}`, children: delta }) : null] })] }));
}
export function SectionHeader({ eyebrow, title, action }) {
    return (_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase tracking-[0.32em] text-cyan-300/70", children: eyebrow }), _jsx("h2", { className: "mt-2 text-xl font-semibold text-white md:text-2xl", children: title })] }), action] }));
}
export function StatusPill({ status }) {
    const styles = {
        confirmed: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
        pending: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
        flagged: 'bg-red-500/10 text-red-200 border-red-500/20',
        expired: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
        open: 'bg-red-500/10 text-red-200 border-red-500/20',
        active: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20',
        ok: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
        ready: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20'
    };
    return _jsx("span", { className: `inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${styles[status] ?? styles.expired}`, children: status });
}
export function LiveDot() {
    return _jsx("span", { className: "inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.12)]" });
}
export function PageTransition({ children }) {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.25, ease: 'easeOut' }, children: children }));
}
