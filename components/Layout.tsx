import React from 'react';
import { ViewState } from '../types';
import { Dumbbell, Calendar, Activity, TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { view: ViewState.HOME, label: 'Treinar', icon: Dumbbell },
    { view: ViewState.PLANNER, label: 'Planejar', icon: Calendar },
    { view: ViewState.HISTORY, label: 'Histórico', icon: Activity },
    { view: ViewState.BODY, label: 'Evolução', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col h-screen bg-darker text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Titanium Fit AI
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-slate-700 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};