import React, { useEffect, useState } from 'react';
import { WorkoutLog } from '../types';
import { StorageService } from '../services/storage';
import { ExportService } from '../services/exportService';
import { Calendar, Download, Clock, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const History: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    const data = StorageService.getLogs();
    // Sort descending
    setLogs(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleExport = () => {
    const exportData = logs.map(log => ({
      Data: format(new Date(log.date), 'dd/MM/yyyy HH:mm'),
      Treino: log.routineName,
      'Duração (min)': Math.floor(log.durationSeconds / 60),
      'Exercícios': log.exercisesCompleted,
      'Volume Total (kg)': log.totalVolume
    }));
    ExportService.exportData(exportData, 'Historico_Treinos_Titanium');
  };

  const getStats = () => {
    const totalWorkouts = logs.length;
    const totalTime = logs.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const totalVolume = logs.reduce((acc, curr) => acc + curr.totalVolume, 0);
    return { totalWorkouts, totalTime, totalVolume };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Histórico</h2>
        <button onClick={handleExport} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-bold bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-500/30">
          <Download size={16} /> Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card p-3 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase">Treinos</p>
          <p className="text-xl font-bold text-white mt-1">{stats.totalWorkouts}</p>
        </div>
        <div className="bg-card p-3 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase">Horas</p>
          <p className="text-xl font-bold text-white mt-1">{(stats.totalTime / 3600).toFixed(1)}h</p>
        </div>
        <div className="bg-card p-3 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase">Volume</p>
          <p className="text-xl font-bold text-white mt-1">{(stats.totalVolume / 1000).toFixed(1)}t</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Calendar size={18} /> Sessões Recentes
        </h3>
        {logs.length === 0 ? (
          <p className="text-slate-500 text-center py-10">Nenhum treino registrado ainda.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="bg-card p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-lg">{log.routineName}</h4>
                  <p className="text-slate-400 text-sm capitalize">
                    {format(new Date(log.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-slate-500 block">
                        {format(new Date(log.date), "HH:mm")}
                    </span>
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-1 text-slate-300 text-sm">
                    <Clock size={14} className="text-blue-400"/>
                    {Math.floor(log.durationSeconds / 60)} min
                </div>
                <div className="flex items-center gap-1 text-slate-300 text-sm">
                    <Dumbbell size={14} className="text-purple-400"/>
                    {log.exercisesCompleted} ex
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};