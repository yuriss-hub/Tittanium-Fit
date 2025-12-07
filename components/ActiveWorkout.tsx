import React, { useState, useEffect, useRef } from 'react';
import { WorkoutRoutine, Exercise, WorkoutLog, ViewState } from '../types';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/gemini';
import { Play, CheckCircle2, Clock, BrainCircuit, XCircle, ArrowLeft } from 'lucide-react';

interface ActiveWorkoutProps {
  setView: (view: ViewState) => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ setView }) => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isResting, setIsResting] = useState(false);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRoutines(StorageService.getRoutines());
  }, []);

  // Timer Effect
  useEffect(() => {
    if (isResting && timer > 0) {
      timerRef.current = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isResting) {
      setIsResting(false);
      if(timerRef.current) clearInterval(timerRef.current);
      // Play a sound could go here
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResting, timer]);

  const startRoutine = (routine: WorkoutRoutine) => {
    setActiveRoutine(routine);
    setStartTime(Date.now());
    setCurrentExerciseIndex(0);
    setCompletedExercises(new Set());
    setAiTip('');
  };

  const finishWorkout = () => {
    if (!activeRoutine) return;
    
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const log: WorkoutLog = {
      id: Date.now().toString(),
      routineId: activeRoutine.id,
      routineName: activeRoutine.name,
      date: new Date().toISOString(),
      durationSeconds: duration,
      exercisesCompleted: completedExercises.size,
      totalVolume: activeRoutine.exercises.reduce((acc, ex) => acc + (ex.weight * ex.sets * parseInt(ex.reps.split('-')[0] || '0')), 0) // Approximation
    };

    StorageService.saveLog(log);
    alert('Treino finalizado com sucesso! 💪');
    setActiveRoutine(null);
    setView(ViewState.HISTORY);
  };

  const handleExerciseComplete = (index: number) => {
    const exercise = activeRoutine?.exercises[index];
    if (exercise) {
      setTimer(exercise.restTime);
      setIsResting(true);
    }
    
    const newCompleted = new Set(completedExercises);
    newCompleted.add(index);
    setCompletedExercises(newCompleted);

    // Auto advance if valid
    if (index < (activeRoutine?.exercises.length || 0) - 1) {
       // Optional: delay advance or require manual click
    }
  };

  const getAiHelp = async (exercise: Exercise) => {
    setLoadingTip(true);
    setAiTip('');
    const tip = await GeminiService.getExerciseTips(exercise.name, exercise.notes);
    setAiTip(tip);
    setLoadingTip(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Selector View
  if (!activeRoutine) {
    return (
      <div className="space-y-6">
         <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Hora de Esmagar! 💥</h2>
            <p className="text-slate-400">Selecione uma rotina para começar</p>
         </div>
         
         <div className="grid gap-4">
            {routines.map(routine => (
              <button 
                key={routine.id}
                onClick={() => startRoutine(routine)}
                className="bg-gradient-to-br from-card to-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 shadow-lg text-left group transition-all"
              >
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{routine.name}</h3>
                   <div className="bg-blue-600 rounded-full p-3 shadow-blue-500/50 shadow-md">
                     <Play fill="white" size={20} className="ml-1" />
                   </div>
                </div>
                <p className="text-sm text-slate-400 mt-2">{routine.exercises.length} exercícios planejados</p>
              </button>
            ))}
            {routines.length === 0 && (
                <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl">
                    <p className="text-slate-500">Você ainda não tem treinos planejados.</p>
                    <button onClick={() => setView(ViewState.PLANNER)} className="text-blue-400 font-bold mt-2">Criar Treino</button>
                </div>
            )}
         </div>
      </div>
    );
  }

  // Active View
  const currentExercise = activeRoutine.exercises[currentExerciseIndex];

  return (
    <div className="h-full flex flex-col relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setActiveRoutine(null)} className="text-slate-400 hover:text-white flex items-center gap-1">
            <ArrowLeft size={18}/> Sair
        </button>
        <span className="font-mono text-blue-400 font-bold text-lg">
            {formatTime(Math.floor((Date.now() - startTime) / 1000))}
        </span>
        <button 
            onClick={finishWorkout} 
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-bold border border-red-500/50 hover:bg-red-500 hover:text-white transition-all"
        >
            Finalizar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-6">
        <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedExercises.size / activeRoutine.exercises.length) * 100}%` }}
        ></div>
      </div>

      {/* Exercise Card */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {activeRoutine.exercises.map((exercise, idx) => {
            const isCurrent = idx === currentExerciseIndex;
            const isDone = completedExercises.has(idx);

            if (!isCurrent && !isDone && idx !== currentExerciseIndex + 1) return null; // Show current, done, and next

            return (
                <div 
                    key={exercise.id} 
                    className={`rounded-2xl p-6 border transition-all ${
                        isCurrent 
                            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500 shadow-blue-900/20 shadow-xl scale-100' 
                            : isDone
                                ? 'bg-slate-900/50 border-green-900/50 opacity-60'
                                : 'bg-slate-900 border-slate-800 opacity-50'
                    }`}
                    onClick={() => setCurrentExerciseIndex(idx)}
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-2xl font-bold ${isDone ? 'text-green-400 line-through' : 'text-white'}`}>
                            {exercise.name}
                        </h3>
                        {isDone && <CheckCircle2 className="text-green-500" />}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-950/50 p-3 rounded-xl text-center">
                            <span className="block text-slate-400 text-xs uppercase">Séries</span>
                            <span className="text-xl font-bold text-white">{exercise.sets}</span>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl text-center">
                            <span className="block text-slate-400 text-xs uppercase">Reps</span>
                            <span className="text-xl font-bold text-white">{exercise.reps}</span>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl text-center">
                            <span className="block text-slate-400 text-xs uppercase">Kg</span>
                            <span className="text-xl font-bold text-white">{exercise.weight}</span>
                        </div>
                    </div>

                    {isCurrent && (
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleExerciseComplete(idx); }}
                                    className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                                        isResting 
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                    }`}
                                    disabled={isResting}
                                >
                                    {isResting ? 'Descansando...' : 'Concluir Série'}
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); getAiHelp(exercise); }}
                                    className="px-4 bg-purple-600/20 text-purple-400 border border-purple-500/50 rounded-xl hover:bg-purple-600 hover:text-white transition-all"
                                    title="Dicas do Coach AI"
                                >
                                    <BrainCircuit size={24} />
                                </button>
                            </div>

                            {/* AI Tip Display */}
                            {(loadingTip || aiTip) && (
                                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl mt-4 animate-fade-in">
                                    <h4 className="text-purple-300 text-sm font-bold mb-2 flex items-center gap-2">
                                        <BrainCircuit size={16}/> Titanium Coach
                                    </h4>
                                    {loadingTip ? (
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                                            {aiTip}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {/* Rest Timer Overlay */}
      {isResting && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
             <div className="relative mb-8">
                <div className="w-48 h-48 rounded-full border-4 border-slate-700 flex items-center justify-center">
                    <div className="text-6xl font-bold font-mono text-blue-400">
                        {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-t-4 border-blue-500 animate-spin duration-1000"></div>
             </div>
             <p className="text-slate-300 text-xl mb-8">Recuperando energia...</p>
             <button 
                onClick={() => { setIsResting(false); setTimer(0); }}
                className="bg-slate-700 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-600 flex items-center gap-2"
             >
                <XCircle /> Pular Descanso
             </button>
        </div>
      )}
    </div>
  );
};