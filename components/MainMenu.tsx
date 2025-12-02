import React from 'react';
import { ViewState } from '../types';
import { Skull, Gamepad2, HeartHandshake } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (view: ViewState) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex flex-col items-center pb-20">
      
      {/* Full Header Image */}
      <div className="w-full h-64 md:h-96 relative border-b-4 border-red-600 overflow-hidden mb-10 group">
         <img 
            src="https://files.catbox.moe/gxohcj.jpg" 
            alt="Header" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-4xl md:text-6xl font-['Press_Start_2P'] text-red-600 drop-shadow-[4px_4px_0_#ffff00] text-center px-4 leading-tight animate-pulse">
                WORLD BRAIN
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-yellow-400 font-bold bg-black px-4 py-1 border border-red-600">
                APOCALYPSE PROTOCOL
            </p>
         </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        
        {/* Card 1: VIRTEX */}
        <div 
            onClick={() => onNavigate(ViewState.VIRTEX)}
            className="bg-[#0f0000] border-2 border-red-600 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] group"
        >
            <Skull className="w-24 h-24 mb-4 text-red-500 group-hover:text-white transition-colors" />
            <h2 className="text-2xl font-['Press_Start_2P'] text-red-500 mb-4 group-hover:text-yellow-400">VIRTEX COMBO</h2>
            <p className="text-lg text-gray-400">
                Alat pemusnah massal untuk WhatsApp. Hati-hati.
            </p>
            <button className="mt-6 bg-red-900 text-white px-6 py-2 font-bold uppercase tracking-widest border border-red-500 group-hover:bg-red-600">
                BUKA
            </button>
        </div>

        {/* Card 2: GAMES */}
        <div 
            onClick={() => onNavigate(ViewState.GAMES)}
            className="bg-[#0f0000] border-2 border-red-600 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] group"
        >
            <Gamepad2 className="w-24 h-24 mb-4 text-red-500 group-hover:text-white transition-colors" />
            <h2 className="text-2xl font-['Press_Start_2P'] text-red-500 mb-4 group-hover:text-yellow-400">GAME KOLEKSI</h2>
            <p className="text-lg text-gray-400">
                Zona hiburan gelap. Mainkan jika berani.
            </p>
            <button className="mt-6 bg-red-900 text-white px-6 py-2 font-bold uppercase tracking-widest border border-red-500 group-hover:bg-red-600">
                BUKA
            </button>
        </div>

        {/* Card 3: MIKU AI */}
        <div 
            onClick={() => onNavigate(ViewState.MIKU)}
            className="bg-[#0f0000] border-2 border-red-600 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] group"
        >
            <HeartHandshake className="w-24 h-24 mb-4 text-red-500 group-hover:text-white transition-colors" />
            <h2 className="text-2xl font-['Press_Start_2P'] text-red-500 mb-4 group-hover:text-yellow-400">MIKU NAKANO AI</h2>
            <p className="text-lg text-gray-400">
                Teman bicara virtual. Jangan membuatnya marah.
            </p>
            <button className="mt-6 bg-red-900 text-white px-6 py-2 font-bold uppercase tracking-widest border border-red-500 group-hover:bg-red-600">
                BUKA
            </button>
        </div>

      </div>

      <footer className="mt-20 text-red-800 text-sm font-['Consolas']">
        © 2024 WORLD BRAIN. ALL RIGHTS RESERVED IN HELL.
      </footer>
    </div>
  );
};

export default MainMenu;