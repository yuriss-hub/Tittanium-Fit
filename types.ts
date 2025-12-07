export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // string to allow ranges e.g. "10-12"
  weight: number; // in kg
  restTime: number; // in seconds
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutLog {
  id: string;
  routineId: string;
  routineName: string;
  date: string; // ISO date string
  durationSeconds: number;
  exercisesCompleted: number;
  totalVolume: number; // rough calculation: sets * reps * weight
}

export interface BodyStat {
  id: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  fatMass?: number;
  visceralFat?: number;
}

export enum ViewState {
  HOME = 'HOME',
  PLANNER = 'PLANNER',
  ACTIVE = 'ACTIVE',
  HISTORY = 'HISTORY',
  BODY = 'BODY'
}