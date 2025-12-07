import { WorkoutRoutine, WorkoutLog, BodyStat } from '../types';

const KEYS = {
  ROUTINES: 'titanium_routines',
  LOGS: 'titanium_logs',
  BODY_STATS: 'titanium_body_stats'
};

export const StorageService = {
  getRoutines: (): WorkoutRoutine[] => {
    const data = localStorage.getItem(KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  },
  
  saveRoutine: (routine: WorkoutRoutine) => {
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
    const routines = StorageService.getRoutines().filter(r => r.id !== id);
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },

  getLogs: (): WorkoutLog[] => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  saveLog: (log: WorkoutLog) => {
    const logs = StorageService.getLogs();
    logs.push(log);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },

  getBodyStats: (): BodyStat[] => {
    const data = localStorage.getItem(KEYS.BODY_STATS);
    // Sort by date ascending
    const stats = data ? JSON.parse(data) : [];
    return stats.sort((a: BodyStat, b: BodyStat) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  saveBodyStat: (stat: BodyStat) => {
    const stats = StorageService.getBodyStats();
    stats.push(stat);
    localStorage.setItem(KEYS.BODY_STATS, JSON.stringify(stats));
  }
};