import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useSessionStore = create()(persist(set => ({
    user: null,
    overview: null,
    sessions: [],
    notifications: [],
    setUser: user => set({ user }),
    setOverview: overview => set({ overview }),
    setSessions: sessions => set({ sessions }),
    setNotifications: notifications => set({ notifications }),
    logout: () => set({ user: null, overview: null, sessions: [], notifications: [] })
}), { name: 'attendance-session' }));
