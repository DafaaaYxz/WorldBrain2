import React, { useState } from 'react';
import { MousePointer2 } from 'lucide-react';

interface GamesProps {
    onBack: () => void;
}

const Games: React.FC<GamesProps> = ({ onBack }) => {
    const [score, setScore] = useState(0);

    const gamesList = [
        {
            id: 'clicker',
            name: "DOOMSDAY CLICKER",
            description: "Klik untuk menghancurkan server.",
            active: true
        },
        {
            id: 'snake',
            name: "CYBER SNAKE",
            description: "Coming Soon...",
            active: false
        },
        {
            id: 'hack',
            name: "BRUTE FORCE SIM",
            description: "Coming Soon...",
            active: false
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto text-center">
             <h1 className="text-4xl md:text-6xl font-['Press_Start_2P'] text-red-600 mb-12 drop-shadow-[4px_4px_0_#ffff00]">
                GAME KOLEKSI
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Active Game: Clicker */}
                <div className="bg-[#100] border-4 border-green-600 p-6 shadow-[0_0_20px_#0f0] rounded-lg">
                    <h2 className="text-2xl font-bold text-green-500 mb-2 font-['Press_Start_2P']">DOOM CLICKER</h2>
                    <div className="h-40 bg-black flex flex-col items-center justify-center border border-green-900 mb-4">
                        <span className="text-4xl text-white mb-2">{score}</span>
                        <span className="text-xs text-green-700">SERVER DESTROYED</span>
                    </div>
                    <button 
                        onClick={() => setScore(s => s + 1)}
                        className="w-full bg-green-800 text-white py-4 font-bold uppercase hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <MousePointer2 /> HANCURKAN
                    </button>
                </div>

                {/* Placeholder Games */}
                {gamesList.slice(1).map(game => (
                    <div key={game.id} className="bg-[#100] border-2 border-red-900 p-6 opacity-60 rounded-lg grayscale">
                        <h2 className="text-xl font-bold text-red-800 mb-2 font-['Press_Start_2P']">{game.name}</h2>
                        <div className="h-40 bg-black flex items-center justify-center border border-red-900 mb-4">
                            <span className="text-red-900 font-bold text-xl">LOCKED</span>
                        </div>
                        <button disabled className="w-full bg-red-950 text-red-800 py-4 font-bold uppercase cursor-not-allowed">
                            {game.description}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Games;