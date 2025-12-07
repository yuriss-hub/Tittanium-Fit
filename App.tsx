'use client';

import React, { useState } from 'react';
import { ViewState } from './types';
import { Layout } from './components/Layout';
import { Planner } from './components/Planner';
import { ActiveWorkout } from './components/ActiveWorkout';
import { History } from './components/History';
import { BodyEvolution } from './components/BodyEvolution';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.ACTIVE);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
      case ViewState.ACTIVE:
        return <ActiveWorkout setView={setCurrentView} />;
      case ViewState.PLANNER:
        return <Planner setView={setCurrentView} />;
      case ViewState.HISTORY:
        return <History />;
      case ViewState.BODY:
        return <BodyEvolution />;
      default:
        return <ActiveWorkout setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;