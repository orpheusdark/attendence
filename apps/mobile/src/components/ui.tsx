import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

export function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`rounded-[28px] border border-white/10 bg-white/5 ${className}`}>{children}</View>;
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'danger' | 'warning' }) {
  const toneClass = tone === 'danger' ? 'border-red-400/20 bg-red-400/10 text-red-100' : tone === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : tone === 'warning' ? 'border-amber-400/20 bg-amber-400/10 text-amber-100' : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100';
  return <View className={`rounded-full border px-3 py-1 ${toneClass}`}><Text className="text-[11px] font-medium uppercase tracking-[0.24em]">{children}</Text></View>;
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <Surface className="flex-1 p-4">
      <Text className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</Text>
      <Text className="mt-2 text-3xl font-semibold text-white">{value}</Text>
      {detail ? <Text className="mt-1 text-xs text-slate-500">{detail}</Text> : null}
    </Surface>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded-2xl bg-cyan-400 px-5 py-4 active:opacity-90">
      <Text className="text-center text-base font-semibold text-slate-950">{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View>
      <Text className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">{eyebrow}</Text>
      <Text className="mt-2 text-2xl font-semibold text-white">{title}</Text>
    </View>
  );
}
