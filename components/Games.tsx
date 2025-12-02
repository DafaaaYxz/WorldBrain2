import React, { useState, useEffect, useRef } from 'react';
import { 
    MousePointer2, ArrowLeft, Terminal, Activity, 
    Grid3x3, RotateCcw, 
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
    Trophy
} from 'lucide-react';

// --- SHARED TYPES ---
type GameView = 'menu' | 'clicker' | 'snake' | 'breaker' | 'reflex';

interface GamesProps {
    onBack: () => void;
}

// --- SUB-COMPONENTS FOR GAMES ---

// 1. DOOMSDAY CLICKER
const ClickerGame = () => {
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);

    const handleClick = () => {
        setScore(s => s + (1 * multiplier));
    };

    const handleUpgrade = () => {
        if (score >= 50 * multiplier) {
            setScore(s => s - (50 * multiplier));
            setMultiplier(m => m + 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-4">
            <h2 className="text-2xl md:text-4xl font-['Press_Start_2P'] mb-8 text-center text-red-500 animate-pulse">DOOM CLICKER</h2>
            
            <div className="bg-[#1a0000] border-4 border-red-600 p-8 rounded-xl w-full text-center shadow-[0_0_30px_#f00] mb-8">
                <div className="text-gray-400 mb-2 font-bold text-xl">SERVER HANCUR</div>
                <div className="text-4xl md:text-6xl font-['Press_Start_2P'] text-white mb-4 break-words">{score}</div>
                <div className="text-red-400 text-sm">MULTIPLIER: x{multiplier}</div>
            </div>

            <button 
                onClick={handleClick}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-['Press_Start_2P'] py-6 rounded-xl shadow-[0_5px_0_#900] active:translate-y-1 active:shadow-none mb-4 transition-all"
            >
                HANCURKAN
            </button>

            <button 
                onClick={handleUpgrade}
                disabled={score < 50 * multiplier}
                className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-4 rounded border-2 border-yellow-400"
            >
                UPGRADE ALAT (Cost: {50 * multiplier})
            </button>
        </div>
    );
};

// 2. CYBER SNAKE
const SnakeGame = () => {
    const GRID_SIZE = 20;
    const SPEED = 150;
    
    const [snake, setSnake] = useState([{x: 10, y: 10}]);
    const [food, setFood] = useState({x: 15, y: 15});
    const [direction, setDirection] = useState<'UP'|'DOWN'|'LEFT'|'RIGHT'>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

    // Spawn Food
    const spawnFood = () => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    };

    // Reset
    const resetGame = () => {
        setSnake([{x: 10, y: 10}]);
        setFood(spawnFood());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
    };

    // Game Loop
    useEffect(() => {
        if (gameOver) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = { ...prevSnake[0] };

                switch (direction) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }

                // Check collision with walls
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check collision with self
                if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [head, ...prevSnake];

                // Check food
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 1);
                    setFood(spawnFood());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        gameLoopRef.current = setInterval(moveSnake, SPEED);
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [direction, food, gameOver]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': if(direction !== 'DOWN') setDirection('UP'); break;
                case 'ArrowDown': if(direction !== 'UP') setDirection('DOWN'); break;
                case 'ArrowLeft': if(direction !== 'RIGHT') setDirection('LEFT'); break;
                case 'ArrowRight': if(direction !== 'LEFT') setDirection('RIGHT'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full max-w-sm mb-4 items-center">
                <h2 className="text-xl font-['Press_Start_2P'] text-green-500">CYBER SNAKE</h2>
                <div className="text-white font-bold">SCORE: {score}</div>
            </div>

            <div 
                className="bg-black border-4 border-green-600 relative mb-6 shadow-[0_0_20px_#0f0]"
                style={{ width: '300px', height: '300px', display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
                {/* Overlay for Game Over */}
                {gameOver && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                        <div className="text-red-500 font-['Press_Start_2P'] mb-4 text-xl">GAME OVER</div>
                        <button onClick={resetGame} className="bg-green-600 text-black px-4 py-2 font-bold font-['Press_Start_2P'] flex items-center gap-2 hover:bg-green-500">
                            <RotateCcw size={16}/> RETRY
                        </button>
                    </div>
                )}

                {/* Grid Rendering */}
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isSnake = snake.some(s => s.x === x && s.y === y);
                    const isFood = food.x === x && food.y === y;
                    
                    return (
                        <div 
                            key={i} 
                            className={`w-full h-full ${isSnake ? 'bg-green-500 shadow-[0_0_5px_#0f0]' : ''} ${isFood ? 'bg-red-500 animate-pulse rounded-full' : ''}`}
                        />
                    );
                })}
            </div>

            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 w-48 select-none">
                <div />
                <button 
                    className="bg-gray-800 p-4 rounded active:bg-green-900 border border-green-900 touch-manipulation"
                    onClick={(e) => { e.preventDefault(); if(direction !== 'DOWN') setDirection('UP'); }}
                ><ChevronUp className="text-white mx-auto"/></button>
                <div />
                
                <button 
                    className="bg-gray-800 p-4 rounded active:bg-green-900 border border-green-900 touch-manipulation"
                    onClick={(e) => { e.preventDefault(); if(direction !== 'RIGHT') setDirection('LEFT'); }}
                ><ChevronLeft className="text-white mx-auto"/></button>
                
                <div />

                <button 
                    className="bg-gray-800 p-4 rounded active:bg-green-900 border border-green-900 touch-manipulation"
                    onClick={(e) => { e.preventDefault(); if(direction !== 'LEFT') setDirection('RIGHT'); }}
                ><ChevronRight className="text-white mx-auto"/></button>
                
                <div />
                 <button 
                    className="bg-gray-800 p-4 rounded active:bg-green-900 border border-green-900 touch-manipulation"
                    onClick={(e) => { e.preventDefault(); if(direction !== 'UP') setDirection('DOWN'); }}
                ><ChevronDown className="text-white mx-auto"/></button>
                <div />
            </div>
        </div>
    );
};

// 3. CODE BREAKER
const BreakerGame = () => {
    const [secret, setSecret] = useState('');
    const [guess, setGuess] = useState('');
    const [history, setHistory] = useState<{guess: string, result: string}[]>([]);
    const [won, setWon] = useState(false);

    useEffect(() => {
        newGame();
    }, []);

    const newGame = () => {
        // Generate random 3 digit string
        const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setSecret(num);
        setHistory([]);
        setWon(false);
        setGuess('');
    };

    const handleGuess = () => {
        if (guess.length !== 3) return;

        let result = '';
        if (guess === secret) {
            result = "ACCESS GRANTED";
            setWon(true);
        } else {
            const guessNum = parseInt(guess);
            const secretNum = parseInt(secret);
            result = guessNum < secretNum ? "TOO LOW" : "TOO HIGH";
        }

        setHistory(prev => [{guess, result}, ...prev]);
        setGuess('');
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <h2 className="text-2xl font-['Press_Start_2P'] text-blue-400 mb-6 text-center">BRUTE FORCE SIM</h2>
            
            <div className="bg-[#000510] border-2 border-blue-500 w-full p-6 rounded-lg mb-6 shadow-[0_0_20px_#00f]">
                <div className="text-center mb-4">
                    <p className="text-blue-300 mb-2">CRACK THE 3-DIGIT PIN</p>
                    <div className="text-4xl font-mono tracking-[1em] text-white bg-blue-900/30 p-2 rounded">
                        {won ? secret : '***'}
                    </div>
                </div>

                {!won ? (
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            value={guess}
                            onChange={(e) => setGuess(e.target.value.slice(0, 3))}
                            placeholder="000"
                            className="w-full bg-black border border-blue-500 text-white p-3 text-center text-xl font-bold rounded focus:outline-none focus:ring-2 ring-blue-400"
                        />
                        <button 
                            onClick={handleGuess}
                            className="bg-blue-600 text-white px-6 font-bold rounded hover:bg-blue-500"
                        >
                            TRY
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={newGame}
                        className="w-full bg-green-600 text-white p-4 font-bold rounded hover:bg-green-500 animate-pulse"
                    >
                        SYSTEM HACKED! PLAY AGAIN
                    </button>
                )}
            </div>

            <div className="w-full bg-black/50 border border-gray-800 rounded p-4 h-64 overflow-y-auto">
                <h3 className="text-gray-500 text-sm mb-2 border-b border-gray-800 pb-1">TERMINAL LOGS</h3>
                {history.map((h, i) => (
                    <div key={i} className="flex justify-between font-mono text-lg mb-1">
                        <span className="text-white">Input: {h.guess}</span>
                        <span className={`${h.result === 'ACCESS GRANTED' ? 'text-green-400' : 'text-yellow-500'}`}>
                            {h.result}
                        </span>
                    </div>
                ))}
                {history.length === 0 && <div className="text-gray-700 italic">Waiting for input...</div>}
            </div>
        </div>
    );
};

// 4. REFLEX HACK
const ReflexGame = () => {
    const [state, setState] = useState<'waiting' | 'ready' | 'now' | 'finished' | 'early'>('waiting');
    const [time, setTime] = useState(0);
    const startTimeRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = () => {
        setState('ready');
        const delay = 1000 + Math.random() * 3000; // 1-4 seconds
        timerRef.current = setTimeout(() => {
            setState('now');
            startTimeRef.current = Date.now();
        }, delay);
    };

    const handleClick = () => {
        if (state === 'ready') {
            if (timerRef.current) clearTimeout(timerRef.current);
            setState('early');
        } else if (state === 'now') {
            const endTime = Date.now();
            setTime(endTime - startTimeRef.current);
            setState('finished');
        } else if (state === 'waiting' || state === 'finished' || state === 'early') {
            startGame();
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    let bgColor = 'bg-gray-900';
    let text = "TAP TO START";
    
    if (state === 'ready') {
        bgColor = 'bg-red-900';
        text = "WAIT FOR GREEN...";
    } else if (state === 'now') {
        bgColor = 'bg-green-600';
        text = "CLICK NOW!";
    } else if (state === 'finished') {
        bgColor = 'bg-blue-900';
        text = `${time}ms`;
    } else if (state === 'early') {
        bgColor = 'bg-yellow-900';
        text = "TOO EARLY!";
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <h2 className="text-2xl font-['Press_Start_2P'] text-white mb-4 text-center">NEURAL LINK TEST</h2>
            
            <div 
                onMouseDown={handleClick}
                onTouchStart={(e) => { e.preventDefault(); handleClick(); }}
                className={`${bgColor} w-full max-w-lg aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-100 shadow-[0_0_30px_rgba(255,255,255,0.2)] select-none border-4 border-white/20`}
            >
                {state === 'finished' && <Trophy className="w-16 h-16 text-yellow-400 mb-4" />}
                <h1 className="text-3xl md:text-6xl font-black text-white tracking-wider text-center px-4 font-['Press_Start_2P']">
                    {text}
                </h1>
                {state === 'finished' && (
                    <p className="text-white mt-4 font-bold">CLICK TO RETRY</p>
                )}
                {state === 'early' && (
                    <p className="text-white mt-4 font-bold">CLICK TO RETRY</p>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const Games: React.FC<GamesProps> = ({ onBack }) => {
    const [activeGame, setActiveGame] = useState<GameView>('menu');

    return (
        <div className="w-full min-h-screen flex flex-col p-4 md:p-8">
            
            {activeGame === 'menu' ? (
                // --- MENU VIEW ---
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                         <h1 className="text-2xl md:text-6xl font-['Press_Start_2P'] text-red-600 drop-shadow-[4px_4px_0_#ffff00]">
                            GAME KOLEKSI
                        </h1>
                        <button onClick={onBack} className="md:hidden border border-red-600 p-2 text-red-600 hover:bg-red-900 hover:text-white font-bold">
                            EXIT
                        </button>
                    </div>
                   
                    <p className="text-yellow-400 mb-8 font-bold text-xl border-l-4 border-red-600 pl-4">
                        PILIH SIMULASI PELATIHAN:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        
                        {/* Game 1 */}
                        <div 
                            onClick={() => setActiveGame('clicker')}
                            className="bg-[#100] border-4 border-red-600 p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <MousePointer2 className="w-12 h-12 text-red-500 group-hover:text-white" />
                                <h3 className="text-2xl font-['Press_Start_2P'] text-red-400 group-hover:text-yellow-400">DOOM CLICKER</h3>
                            </div>
                            <p className="text-gray-400 font-bold mb-4">Hancurkan server dengan kekuatan jarimu. Upgrade sistem untuk kehancuran massal.</p>
                            <div className="bg-red-900/20 text-red-500 px-3 py-1 inline-block rounded text-sm font-mono border border-red-800">STATUS: ONLINE</div>
                        </div>

                        {/* Game 2 */}
                        <div 
                            onClick={() => setActiveGame('snake')}
                            className="bg-[#001000] border-4 border-green-600 p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Grid3x3 className="w-12 h-12 text-green-500 group-hover:text-white" />
                                <h3 className="text-2xl font-['Press_Start_2P'] text-green-400 group-hover:text-white">CYBER SNAKE</h3>
                            </div>
                            <p className="text-gray-400 font-bold mb-4">Ular data klasik. Makan bit data, bertambah panjang. Jangan tabrak firewall.</p>
                            <div className="bg-green-900/20 text-green-500 px-3 py-1 inline-block rounded text-sm font-mono border border-green-800">STATUS: ONLINE</div>
                        </div>

                        {/* Game 3 */}
                        <div 
                            onClick={() => setActiveGame('breaker')}
                            className="bg-[#000510] border-4 border-blue-600 p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform hover:shadow-[0_0_30px_rgba(0,0,255,0.4)] group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Terminal className="w-12 h-12 text-blue-500 group-hover:text-white" />
                                <h3 className="text-2xl font-['Press_Start_2P'] text-blue-400 group-hover:text-white">BRUTE FORCE</h3>
                            </div>
                            <p className="text-gray-400 font-bold mb-4">Tebak PIN keamanan 3 digit. Gunakan logika 'High/Low' untuk membobol.</p>
                            <div className="bg-blue-900/20 text-blue-500 px-3 py-1 inline-block rounded text-sm font-mono border border-blue-800">STATUS: ONLINE</div>
                        </div>

                        {/* Game 4 */}
                        <div 
                            onClick={() => setActiveGame('reflex')}
                            className="bg-[#101000] border-4 border-yellow-600 p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform hover:shadow-[0_0_30px_rgba(255,255,0,0.4)] group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Activity className="w-12 h-12 text-yellow-500 group-hover:text-white" />
                                <h3 className="text-2xl font-['Press_Start_2P'] text-yellow-400 group-hover:text-white">NEURAL LINK</h3>
                            </div>
                            <p className="text-gray-400 font-bold mb-4">Uji kecepatan reaksimu. Klik saat layar berubah hijau. Milidetik sangat berarti.</p>
                            <div className="bg-yellow-900/20 text-yellow-500 px-3 py-1 inline-block rounded text-sm font-mono border border-yellow-800">STATUS: ONLINE</div>
                        </div>

                    </div>
                </div>
            ) : (
                // --- GAME ACTIVE VIEW ---
                <div className="w-full h-full flex flex-col items-center">
                    <button 
                        onClick={() => setActiveGame('menu')}
                        className="self-start mb-6 flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 font-bold"
                    >
                        <ArrowLeft /> KEMBALI KE MENU
                    </button>
                    
                    <div className="w-full flex-1">
                        {activeGame === 'clicker' && <ClickerGame />}
                        {activeGame === 'snake' && <SnakeGame />}
                        {activeGame === 'breaker' && <BreakerGame />}
                        {activeGame === 'reflex' && <ReflexGame />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Games;