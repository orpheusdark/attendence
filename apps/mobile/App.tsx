import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Animated, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { closeSocket, getSocket, joinSessionRoom, leaveSessionRoom } from './src/lib/socket';
import { getLiveSummary, getNotifications, getOverview, getSessions, setToken } from './src/lib/api';
import { Badge, PrimaryButton, SectionTitle, StatCard, Surface } from './src/components/ui';

type TabKey = 'Home' | 'Scan' | 'League' | 'History' | 'Profile';

const Stack = createNativeStackNavigator();

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'Home', label: 'Home' },
  { key: 'Scan', label: 'Scan' },
  { key: 'League', label: 'League' },
  { key: 'History', label: 'History' },
  { key: 'Profile', label: 'Profile' }
];

function TabBar({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <View className="flex-row rounded-[24px] border border-white/10 bg-slate-950/95 px-2 py-2">
      {tabs.map(tab => (
        <Pressable key={tab.key} onPress={() => onChange(tab.key)} className={`flex-1 rounded-2xl py-3 ${active === tab.key ? 'bg-cyan-400' : ''}`}>
          <Text className={`text-center text-[11px] font-semibold uppercase tracking-[0.24em] ${active === tab.key ? 'text-slate-950' : 'text-slate-400'}`}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function LoginScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-5 py-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center gap-6">
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10"><Text className="text-3xl text-cyan-100">A</Text></View>
            <Text className="mt-6 text-center text-3xl font-semibold text-white">Secure attendance</Text>
            <Text className="mt-3 max-w-sm text-center text-slate-400">Rolling QR, reverse verification, geofence controls, and realtime fraud monitoring.</Text>
          </View>

          <Surface className="gap-4 p-5">
            <View className="rounded-2xl bg-slate-900 px-4 py-4"><Text className="text-slate-500">University email</Text></View>
            <View className="rounded-2xl bg-slate-900 px-4 py-4"><Text className="text-slate-500">Password</Text></View>
            <PrimaryButton label="Sign in" onPress={onComplete} />
            <Text className="text-center text-xs text-slate-500">JWT session tracking · device fingerprinting · immutable audit logs</Text>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeScreen() {
  const [live, setLive] = useState({ activeSessions: 0, confirmed: 0, flagged: 0, openFraud: 0 });
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    let joinedSessionId: string | null = null;
    getLiveSummary().then(setLive).catch(() => undefined);
    getNotifications().then(items => setNotifications(items.slice(0, 3).map(item => item.title))).catch(() => undefined);
    getSessions()
      .then(items => {
        if (items.length > 0) {
          joinedSessionId = items[0]._id;
          joinSessionRoom(joinedSessionId);
        }
      })
      .catch(() => undefined);

    const socket = getSocket();
    socket.on('attendance:session.started', () => setLive(state => ({ ...state, activeSessions: state.activeSessions + 1 })));
    socket.on('attendance:scan.created', () => setLive(state => ({ ...state, confirmed: state.confirmed + 1 })));
    socket.on('attendance:confirmed', () => setLive(state => ({ ...state, confirmed: state.confirmed + 1 })));
    return () => {
      if (joinedSessionId) {
        leaveSessionRoom(joinedSessionId);
      }
      socket.off('attendance:session.started');
      socket.off('attendance:scan.created');
      socket.off('attendance:confirmed');
      closeSocket();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <Text className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/70">good morning, student</Text>
        <Text className="mt-2 text-3xl font-semibold text-white">operational dashboard</Text>
        <Text className="mt-2 text-slate-400">fast access, realtime trust signals, and minimal friction.</Text>

        <Surface className="mt-6 overflow-hidden p-5">
          <Text className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/70">attendance active</Text>
          <Text className="mt-2 text-3xl font-semibold text-white">Operating Systems</Text>
          <Text className="mt-2 text-slate-400">Room B204 · expires in 00:18</Text>
          <View className="mt-5 flex-row flex-wrap gap-3">
            <Badge>live qr</Badge>
            <Badge tone="success">verified</Badge>
            <Badge tone="warning">geofence ready</Badge>
          </View>
          <View className="mt-6 items-center rounded-[24px] bg-white p-5">
            <QRCode value="secure-session-token" size={180} color="#0f172a" />
          </View>
        </Surface>

        <View className="mt-6 flex-row gap-3">
          <StatCard label="attendance" value="92%" detail="weekly consistency" />
          <StatCard label="streak" value="14" detail="days active" />
        </View>
        <View className="mt-3 flex-row gap-3">
          <StatCard label="reliability" value="96" detail="risk-adjusted" />
          <StatCard label="league" value="#04" detail="department rank" />
        </View>

        <Surface className="mt-6 p-5">
          <SectionTitle eyebrow="fraud & security" title="live status" />
          <View className="mt-4 flex-row flex-wrap gap-3">
            <Badge tone="success">mock location blocked</Badge>
            <Badge tone="warning">device fingerprint ok</Badge>
            <Badge tone="danger">0 proxy attempts</Badge>
          </View>
        </Surface>

        <Surface className="mt-6 p-5">
          <SectionTitle eyebrow="alerts" title="notifications" />
          <View className="mt-4 gap-3">
            {notifications.map(item => (
              <View key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Text className="text-slate-200">{item}</Text></View>
            ))}
          </View>
        </Surface>

        <Surface className="mt-6 p-5">
          <SectionTitle eyebrow="realtime" title="activity pulse" />
          <View className="mt-4 gap-3">
            <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Text className="text-slate-200">{live.activeSessions} active sessions</Text></View>
            <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Text className="text-slate-200">{live.confirmed} confirmations</Text></View>
            <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Text className="text-slate-200">{live.flagged} flagged scans</Text></View>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScanScreen() {
  const scanOpacity = useMemo(() => new Animated.Value(0.25), []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(scanOpacity, { toValue: 0.25, duration: 1200, useNativeDriver: true })
      ])
    ).start();
  }, [scanOpacity]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-5 py-6">
      <View className="flex-1 justify-center">
        <Text className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/70">scan attendance</Text>
        <Text className="mt-2 text-3xl font-semibold text-white">secure verification</Text>
        <Text className="mt-2 text-slate-400">dark scanning frame, reverse QR fallback, and haptic confirmation.</Text>

        <View className="mt-8 overflow-hidden rounded-[32px] border border-cyan-400/20 bg-white/5 p-6">
          <View className="aspect-square items-center justify-center rounded-[28px] border border-dashed border-cyan-300/35 bg-slate-950">
            <CameraView style={[StyleSheet.absoluteFillObject, { opacity: 0.08 }]} facing="back" />
            <Animated.View style={{ opacity: scanOpacity }} className="h-[68%] w-[68%] rounded-[28px] border-2 border-cyan-300/70" />
            <View className="absolute h-[72%] w-[72%] rounded-[28px] border border-cyan-300/20" />
            <Text className="mt-4 text-center text-sm text-slate-300">align QR inside the frame</Text>
          </View>
        </View>

        <Surface className="mt-6 p-5">
          <SectionTitle eyebrow="reverse qr" title="digital identity verification" />
          <View className="mt-4 items-center rounded-[24px] bg-white p-4">
            <QRCode value="reverse-verification-token" size={160} color="#0f172a" />
          </View>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

function LeagueScreen() {
  const standings = [
    { name: 'CSE-A', score: 98, rank: 1 },
    { name: 'ECE-B', score: 95, rank: 2 },
    { name: 'MECH-C', score: 92, rank: 3 },
    { name: 'IT-A', score: 89, rank: 4 }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-5 py-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/70">league</Text>
        <Text className="mt-2 text-3xl font-semibold text-white">prestige rankings</Text>
        <Text className="mt-2 text-slate-400">institutional standings, not gamification noise.</Text>

        <Surface className="mt-6 p-5">
          <SectionTitle eyebrow="personal stats" title="reliability score" />
          <View className="mt-4 flex-row gap-3">
            <StatCard label="streak" value="14" detail="days" />
            <StatCard label="consistency" value="96%" detail="strong" />
          </View>
          <View className="mt-3 flex-row gap-3">
            <StatCard label="percentile" value="08" detail="top cohort" />
            <StatCard label="risk" value="02" detail="low" />
          </View>
        </Surface>

        <Surface className="mt-6 p-5">
          <SectionTitle eyebrow="class rankings" title="formula standings" />
          <View className="mt-4 gap-3">
            {standings.map(item => (
              <View key={item.name} className="flex-row items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Text className="text-white">#{item.rank} {item.name}</Text>
                <Text className="text-cyan-200">{item.score}</Text>
              </View>
            ))}
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function HistoryScreen() {
  const sessions = [
    { subject: 'Operating Systems', status: 'confirmed', time: '09:00' },
    { subject: 'Networks', status: 'pending', time: '11:00' },
    { subject: 'DBMS', status: 'confirmed', time: '14:00' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-5 py-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/70">history</Text>
        <Text className="mt-2 text-3xl font-semibold text-white">attendance record</Text>
        <Surface className="mt-6 p-5">
          <View className="gap-3">
            {sessions.map(item => (
              <View key={item.subject} className="flex-row items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <View>
                  <Text className="text-white">{item.subject}</Text>
                  <Text className="text-xs text-slate-500">{item.time}</Text>
                </View>
                <Badge tone={item.status === 'confirmed' ? 'success' : 'warning'}>{item.status}</Badge>
              </View>
            ))}
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-5 py-6">
      <View className="flex-1 justify-center">
        <Surface className="items-center p-6">
          <View className="h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10"><Text className="text-4xl text-cyan-100">A</Text></View>
          <Text className="mt-4 text-2xl font-semibold text-white">student profile</Text>
          <Text className="mt-2 text-slate-400">device locked · secure session active</Text>
          <View className="mt-5 flex-row gap-3">
            <Badge>verified</Badge>
            <Badge tone="success">secure</Badge>
          </View>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [tab, setTab] = useState<TabKey>('Home');

  useEffect(() => {
    setToken('demo-token');
    getOverview().catch(() => undefined);
    getSessions().catch(() => undefined);
  }, []);

  if (!isAuthed) {
    return <LoginScreen onComplete={() => setIsAuthed(true)} />;
  }

  const content = {
    Home: <HomeScreen />,
    Scan: <ScanScreen />,
    League: <LeagueScreen />,
    History: <HistoryScreen />,
    Profile: <ProfileScreen />
  }[tab];

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" options={{ animation: 'fade' }}>
          {() => (
            <SafeAreaView className="flex-1 bg-slate-950">
              <View className="flex-1">{content}</View>
              <View className="absolute bottom-4 left-4 right-4">
                <TabBar active={tab} onChange={async next => { setTab(next); await Haptics.selectionAsync(); }} />
              </View>
            </SafeAreaView>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}