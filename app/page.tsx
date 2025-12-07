'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import App dynamically to disable SSR, preventing localStorage mismatch issues
const App = dynamic(() => import('../App'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
      <div className="text-center animate-pulse">
        <h1 className="text-2xl font-bold text-blue-500 mb-2">Titanium Fit AI</h1>
        <p className="text-slate-400">Carregando sistema...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-full">
      <App />
    </main>
  );
}