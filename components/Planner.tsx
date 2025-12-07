import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, Exercise, ViewState } from '../types';
import { StorageService } from '../services/storage';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';

interface PlannerProps {
  setView: (view: ViewState) => void;
}

export const Planner: React.FC<PlannerProps> = ({ setView }) => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState<WorkoutRoutine | null>(null);

  useEffect(() => {
    setRoutines(StorageService.getRoutines());
  }, []);

  const handleCreateNew = () => {
    const newRoutine: WorkoutRoutine = {
      id: Date.now().toString(),
      name: 'Novo Treino',
      exercises: []
    };
    setCurrentRoutine(newRoutine);
    setIsEditing(true);
  };

  const handleEdit = (routine: WorkoutRoutine) => {
    setCurrentRoutine({ ...routine });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
      StorageService.deleteRoutine(id);
      setRoutines(StorageService.getRoutines());
    }
  };

  const saveCurrentRoutine = () => {
    if (currentRoutine) {
      if (!currentRoutine.name.trim()) return alert("Nome do treino é obrigatório");
      if (currentRoutine.exercises.length === 0) return alert("Adicione pelo menos um exercício");
      
      StorageService.saveRoutine(currentRoutine);
      setRoutines(StorageService.getRoutines());
      setIsEditing(false);
      setCurrentRoutine(null);
    }
  };

  const addExercise = () => {
    if (!currentRoutine) return;
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: '12',
      weight: 0,
      restTime: 60,
    };
    setCurrentRoutine({
      ...currentRoutine,
      exercises: [...currentRoutine.exercises, newExercise]
    });
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    if (!currentRoutine) return;
    const updatedExercises = [...currentRoutine.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setCurrentRoutine({ ...currentRoutine, exercises: updatedExercises });
  };

  const removeExercise = (index: number) => {
    if (!currentRoutine) return;
    const updatedExercises = currentRoutine.exercises.filter((_, i) => i !== index);
    setCurrentRoutine({ ...currentRoutine, exercises: updatedExercises });
  };

  if (isEditing && currentRoutine) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white"><X /></button>
          <h2 className="text-xl font-bold text-white">Editor de Treino</h2>
          <button onClick={saveCurrentRoutine} className="text-blue-400 font-bold flex items-center gap-1"><Save size={18}/> Salvar</button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Nome da Rotina</label>
          <input
            type="text"
            value={currentRoutine.name}
            onChange={(e) => setCurrentRoutine({ ...currentRoutine, name: e.target.value })}
            className="w-full bg-card border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: Treino A - Peito e Tríceps"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-200">Exercícios</h3>
          </div>
          
          {currentRoutine.exercises.map((exercise, index) => (
            <div key={exercise.id} className="bg-card p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-slate-700 text-xs px-2 py-1 rounded-full text-slate-300">#{index + 1}</span>
                <button onClick={() => removeExercise(index)} className="text-red-400"><Trash2 size={16} /></button>
              </div>
              
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateExercise(index, 'name', e.target.value)}
                placeholder="Nome do Exercício (Ex: Supino Reto)"
                className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-white font-medium"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Séries</label>
                  <input type="number" value={exercise.sets} onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))} className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-white text-center" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Reps</label>
                  <input type="text" value={exercise.reps} onChange={(e) => updateExercise(index, 'reps', e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-white text-center" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Carga (kg)</label>
                  <input type="number" value={exercise.weight} onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))} className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-white text-center" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Descanso (s)</label>
                  <input type="number" value={exercise.restTime} onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value))} className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-white text-center" />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addExercise}
            className="w-full py-4 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Plus /> Adicionar Exercício
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Seus Treinos</h2>
        <button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/20">
          <Plus />
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p>Nenhum treino cadastrado.</p>
          <p className="text-sm">Toque no + para criar sua primeira rotina.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {routines.map((routine) => (
            <div key={routine.id} className="bg-card p-5 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{routine.name}</h3>
                  <p className="text-sm text-slate-400">{routine.exercises.length} exercícios</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(routine)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(routine.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};