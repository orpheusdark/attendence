import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalyticsOverview, ApiUser, AttendanceSessionDto, NotificationDto } from '@attendance/shared';

interface SessionState {
  user: ApiUser | null;
  overview: AnalyticsOverview | null;
  sessions: AttendanceSessionDto[];
  notifications: NotificationDto[];
  setUser: (user: ApiUser | null) => void;
  setOverview: (overview: AnalyticsOverview | null) => void;
  setSessions: (sessions: AttendanceSessionDto[]) => void;
  setNotifications: (notifications: NotificationDto[]) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      user: null,
      overview: null,
      sessions: [],
      notifications: [],
      setUser: user => set({ user }),
      setOverview: overview => set({ overview }),
      setSessions: sessions => set({ sessions }),
      setNotifications: notifications => set({ notifications }),
      logout: () => set({ user: null, overview: null, sessions: [], notifications: [] })
    }),
    { name: 'attendance-session' }
  )
);
