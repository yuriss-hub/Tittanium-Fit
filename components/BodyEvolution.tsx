import React, { useState, useEffect } from 'react';
import { BodyStat } from '../types';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/gemini';
import { ExportService } from '../services/exportService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, Download, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const BodyEvolution: React.FC = () => {
  const [stats, setStats] = useState<BodyStat[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStat, setNewStat] = useState<Partial<BodyStat>>({
    weight: 0,
    muscleMass: 0,
    fatMass: 0,
    visceralFat: 0,
    bodyFatPercentage: 0
  });
  const [aiAnalysis, setAiAnalysis] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const data = StorageService.getBodyStats();
    setStats(data);
    if(data.length > 0) {
        const last = data[data.length - 1];
        GeminiService.analyzeProgress(last.weight, last.muscleMass || 0, last.fatMass || 0).then(setAiAnalysis);
    }
  };

  const handleSave = () => {
    if (!newStat.weight) return alert("Peso é obrigatório");
    
    const stat: BodyStat = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: Number(newStat.weight),
      muscleMass: Number(newStat.muscleMass),
      fatMass: Number(newStat.fatMass),
      visceralFat: Number(newStat.visceralFat),
      bodyFatPercentage: Number(newStat.bodyFatPercentage)
    };
    
    StorageService.saveBodyStat(stat);
    loadStats();
    setShowForm(false);
    setNewStat({ weight: 0, muscleMass: 0, fatMass: 0, visceralFat: 0, bodyFatPercentage: 0 });
  };

  const handleExport = () => {
     const exportData = stats.map(s => ({
         Data: format(new Date(s.date), 'dd/MM/yyyy'),
         'Peso (kg)': s.weight,
         'Massa Muscular (kg)': s.muscleMass,
         'Gordura (kg)': s.fatMass,
         '% Gordura': s.bodyFatPercentage
     }));
     ExportService.exportData(exportData, 'Evolucao_Corporal_Titanium');
  };

  const formattedData = stats.map(s => ({
    ...s,
    formattedDate: format(new Date(s.date), 'dd/MM')
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Evolução</h2>
        <div className="flex gap-2">
            <button onClick={handleExport} className="p-2 text-slate-400 hover:text-white"><Download size={20}/></button>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-500"><Plus size={20}/></button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card p-4 rounded-xl border border-slate-700 animate-fade-in space-y-4">
          <h3 className="text-white font-bold">Novo Registro</h3>
          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="text-xs text-slate-400">Peso (kg)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
                   value={newStat.weight || ''} onChange={e => setNewStat({...newStat, weight: parseFloat(e.target.value)})} />
             </div>
             <div>
                <label className="text-xs text-slate-400">% Gordura</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
                   value={newStat.bodyFatPercentage || ''} onChange={e => setNewStat({...newStat, bodyFatPercentage: parseFloat(e.target.value)})} />
             </div>
             <div>
                <label className="text-xs text-slate-400">M. Muscular (kg)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
                   value={newStat.muscleMass || ''} onChange={e => setNewStat({...newStat, muscleMass: parseFloat(e.target.value)})} />
             </div>
             <div>
                <label className="text-xs text-slate-400">M. Gorda (kg)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
                   value={newStat.fatMass || ''} onChange={e => setNewStat({...newStat, fatMass: parseFloat(e.target.value)})} />
             </div>
          </div>
          <button onClick={handleSave} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-500">Salvar Registro</button>
        </div>
      )}

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-purple-400" size={18} />
                <h3 className="font-bold text-slate-200 text-sm">Titanium AI Insight</h3>
            </div>
            <p className="text-sm text-slate-300 italic">"{aiAnalysis}"</p>
        </div>
      )}

      {/* Charts */}
      {stats.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-xl border border-slate-700 h-64">
                <h4 className="text-slate-400 text-xs uppercase mb-4">Peso Corporal (kg)</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" domain={['auto', 'auto']} fontSize={10} />
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}} />
                        <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-card p-4 rounded-xl border border-slate-700 h-64">
                <h4 className="text-slate-400 text-xs uppercase mb-4">Composição Corporal (kg)</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}} />
                        <Legend />
                        <Line type="monotone" dataKey="muscleMass" name="Músculo" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="fatMass" name="Gordura" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
      ) : (
          <div className="text-center py-12 text-slate-500">
              <p>Sem dados de evolução ainda.</p>
              <p className="text-xs mt-2">Adicione seu peso e medidas para ver os gráficos.</p>
          </div>
      )}
    </div>
  );
};