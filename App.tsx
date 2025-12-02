import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import Virtex from './components/Virtex';
import Games from './components/Games';
import MikuChat from './components/MikuChat';
import { Terminal, ShieldAlert, Cpu, Ghost } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOADING);

  useEffect(() => {
    // Simulate the 5 second loading sequence
    if (currentView === ViewState.LOADING) {
      const timer = setTimeout(() => {
        setCurrentView(ViewState.HOME);
      }, 5500); // Slightly longer than 5s to ensure animation finishes
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.LOADING:
        return <LoadingScreen onComplete={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.HOME:
        return <MainMenu onNavigate={setCurrentView} />;
      case ViewState.VIRTEX:
        return <Virtex onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.GAMES:
        return <Games onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.MIKU:
        return <MikuChat onBack={() => setCurrentView(ViewState.HOME)} />;
      default:
        return <MainMenu onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-red-600 font-['VT323'] selection:bg-red-900 selection:text-white overflow-hidden">
      {currentView !== ViewState.LOADING && (
        <nav className="fixed top-0 left-0 w-full bg-black border-b-2 border-red-600 z-50 p-2 flex justify-between items-center h-16 shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            <div className="flex items-center gap-2 px-4 cursor-pointer" onClick={() => setCurrentView(ViewState.HOME)}>
                <Terminal className="w-6 h-6 animate-pulse" />
                <span className="text-2xl font-['Press_Start_2P'] hidden md:block">WORLD BRAIN</span>
            </div>
            <div className="flex gap-4 px-4">
               {currentView !== ViewState.HOME && (
                 <button 
                  onClick={() => setCurrentView(ViewState.HOME)}
                  className="border border-red-600 px-4 py-1 hover:bg-red-900 hover:text-white transition-colors uppercase tracking-widest"
                 >
                   [ KEMBALI ]
                 </button>
               )}
            </div>
        </nav>
      )}
      
      <main className={`${currentView !== ViewState.LOADING ? 'pt-20' : ''} min-h-screen`}>
        {renderView()}
      </main>

      {/* Persistent CRT Scanline Effect */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-10 bg-[url('https://media.giphy.com/media/3o7qE1YN7aQfVJJ0HR/giphy.gif')] bg-cover mix-blend-overlay"></div>
    </div>
  );
};

export default App;