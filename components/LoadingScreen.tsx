import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const logMessages = [
    "Initializing World Brain Protocol...",
    "Connecting to server 192.168.666.1...",
    "Bypassing firewall security...",
    "[ROOT] Access Granted.",
    "Installing dependencies...",
    "Fetching 'virtex-payload'...",
    "Fetching 'miku-nakano-ai-core'...",
    "Compiling destruction modules...",
    "Optimizing for chaos...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let delay = 0;
    logMessages.forEach((msg, index) => {
      delay += Math.random() * 400 + 100; // Random delay between messages
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${msg}`]);
      }, delay);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      {/* Red Overlay Effect */}
      <div className="absolute inset-0 bg-red-900 opacity-10 pointer-events-none"></div>

      {/* Card Container */}
      <div className="w-full max-w-lg bg-[#0a0000] border-2 border-red-600 rounded-lg shadow-[0_0_50px_rgba(255,0,0,0.6)] p-2 relative overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-red-900 text-black px-4 py-2 font-bold font-['Press_Start_2P'] text-xs flex justify-between items-center mb-2">
            <span>TERMUX - INSTALLER</span>
            <div className="flex gap-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
        </div>

        {/* Terminal Content */}
        <div className="h-64 overflow-y-auto font-['Consolas'] text-lg text-red-500 p-2 font-bold tracking-wider">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
          <div className="animate-pulse">_</div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 border border-red-900 h-4 w-full bg-[#1a0000]">
            <div className="h-full bg-red-600 animate-[width_5s_ease-in-out_forwards] w-0"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;