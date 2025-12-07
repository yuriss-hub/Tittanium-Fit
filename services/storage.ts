import { WorkoutRoutine, WorkoutLog, BodyStat } from '../types';

const KEYS = {
  ROUTINES: 'titanium_routines',
  LOGS: 'titanium_logs',
  BODY_STATS: 'titanium_body_stats'
};

const isBrowser = typeof window !== 'undefined';

export const StorageService = {
  getRoutines: (): WorkoutRoutine[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  },
  
  saveRoutine: (routine: WorkoutRoutine) => {
    if (!isBrowser) return;
    const routines = StorageService.getRoutines();
    const existingIndex = routines.findIndex(r => r.id === routine.id);
    if (existingIndex >= 0) {
      routines[existingIndex] = routine;
    } else {
      routines.push(routine);
    }
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },

  deleteRoutine: (id: string) => {
    if (!isBrowser) return;
    const routines = StorageService.getRoutines().filter(r => r.id !== id);
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },

  getLogs: (): WorkoutLog[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  saveLog: (log: WorkoutLog) => {
    if (!isBrowser) return;
    const logs = StorageService.getLogs();
    logs.push(log);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },

  getBodyStats: (): BodyStat[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(KEYS.BODY_STATS);
    // Sort by date ascending
    const stats = data ? JSON.parse(data) : [];
    return stats.sort((a: BodyStat, b: BodyStat) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  saveBodyStat: (stat: BodyStat) => {
    if (!isBrowser) return;
    const stats = StorageService.getBodyStats();
    stats.push(stat);
    localStorage.setItem(KEYS.BODY_STATS, JSON.stringify(stats));
  }
};