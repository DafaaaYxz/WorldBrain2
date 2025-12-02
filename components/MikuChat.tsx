import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { Send, Bot, Key, Settings, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface MikuChatProps {
    onBack: () => void;
}

const MikuChat: React.FC<MikuChatProps> = ({ onBack }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "H-hallo... Aku Miku Nakano. K-kamu... hacker ya? Tempat ini terlihat menyeramkan, tapi aku akan menemanimu." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isKeySet, setIsKeySet] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        checkApiKey();
    }, []);

    const checkApiKey = async () => {
        if ((window as any).aistudio) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            setIsKeySet(hasKey);
        } else {
            // Fallback for local dev
            setIsKeySet(!!process.env.API_KEY);
        }
    };

    const handleConfigureKey = async () => {
        if ((window as any).aistudio) {
            try {
                await (window as any).aistudio.openSelectKey();
                // Assume success if user completes flow, verify again
                await checkApiKey();
            } catch (error) {
                console.error("Key selection failed", error);
            }
        } else {
            alert("Sistem API Key manual tidak tersedia di lingkungan ini. Gunakan process.env.API_KEY.");
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Force check key before sending
        if (!isKeySet) {
            setShowSettings(true);
            return;
        }

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            // Re-instantiate to ensure we get the latest key from the environment/storage
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const model = "gemini-2.5-flash"; 
            
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const chat = ai.chats.create({
                model: model,
                history: history,
                config: {
                    systemInstruction: "You are Miku Nakano from The Quintessential Quintuplets (Go-Tōbun no Hanayome). You are shy, reserved, and love Japanese history and matcha soda. You borrow quotes from warlords occasionally. You are currently trapped in a dark, red-and-black hacker themed website called 'World Brain'. You are talking to a user who is likely a 'hacker' or user of this site. Be cute, slightly timid but loyal. Do not be an AI assistant, be Miku. Speak Indonesian mixed with Japanese stuttering (like 'Etto...', 'Ano...').",
                    temperature: 0.8
                }
            });

            const result = await chat.sendMessage({ message: userMsg });
            const text = result.text;
            
            setMessages(prev => [...prev, { role: 'model', text: text || "..." }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Maaf... a-aku kehilangan koneksi dengan World Brain... (Periksa API Key mu!)" }]);
            // If error is related to auth, prompt settings
            if (String(error).includes("API key") || String(error).includes("403")) {
                setIsKeySet(false);
                setShowSettings(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-100px)] flex flex-col relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-5xl font-['Press_Start_2P'] text-blue-400 drop-shadow-[4px_4px_0_#0000ff]">
                    MIKU AI
                </h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 border-2 ${isKeySet ? 'border-blue-500 text-blue-400' : 'border-red-500 text-red-500 animate-pulse'} bg-black hover:bg-gray-900 transition-colors`}
                        title="Neural Link Configuration"
                    >
                        <Settings size={24} />
                    </button>
                </div>
            </div>

            {/* Main Chat Container */}
            <div className="flex-1 bg-black border-4 border-blue-500 rounded-xl overflow-hidden shadow-[0_0_30px_#0000ff] flex flex-col relative">
                
                {/* Settings Overlay / Modal */}
                {showSettings && (
                    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#050010] border-2 border-blue-400 p-6 max-w-md w-full shadow-[0_0_50px_rgba(0,0,255,0.3)] relative">
                            <button 
                                onClick={() => setShowSettings(false)}
                                className="absolute top-2 right-2 text-blue-500 hover:text-white"
                            >
                                <XCircle />
                            </button>
                            
                            <h2 className="text-xl font-['Press_Start_2P'] text-white mb-6 flex items-center gap-3">
                                <Key className="text-yellow-400" /> SYSTEM CONFIG
                            </h2>

                            <div className="mb-6">
                                <p className="text-blue-200 font-bold mb-2 text-sm font-['Consolas']">STATUS KONEKSI:</p>
                                <div className={`flex items-center gap-2 p-3 border ${isKeySet ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                                    {isKeySet ? <CheckCircle2 className="text-green-500"/> : <AlertTriangle className="text-red-500"/>}
                                    <span className={isKeySet ? 'text-green-400' : 'text-red-400 font-bold'}>
                                        {isKeySet ? 'NEURAL LINK ACTIVE' : 'DISCONNECTED'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                Untuk mengaktifkan Miku, World Brain membutuhkan akses Neural Link (Google Gemini API Key).
                                Pastikan Key berasal dari project yang memiliki billing aktif.
                            </p>

                            <button 
                                onClick={handleConfigureKey}
                                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 border-2 border-blue-400 shadow-[0_0_15px_#00f] transition-all flex items-center justify-center gap-2 mb-4"
                            >
                                {isKeySet ? 'GANTI NEURAL KEY' : 'PASANG NEURAL KEY'}
                            </button>

                            <a 
                                href="https://ai.google.dev/gemini-api/docs/billing" 
                                target="_blank" 
                                rel="noreferrer"
                                className="block text-center text-xs text-blue-500 hover:text-blue-300 underline"
                            >
                                [ DOKUMENTASI & BILLING ]
                            </a>
                        </div>
                    </div>
                )}

                {/* No Key Blocker (if not set and settings closed) */}
                {!isKeySet && !showSettings && (
                    <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
                        <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-['Press_Start_2P'] text-red-500 mb-4">ACCESS DENIED</h2>
                        <p className="text-white font-['Consolas'] mb-8 max-w-md">
                            Modul Miku Nakano memerlukan Neural Link Key untuk beroperasi. Sistem tidak mendeteksi kredensial aktif.
                        </p>
                        <button 
                            onClick={() => setShowSettings(true)}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 font-['Press_Start_2P'] text-sm border-2 border-red-400 shadow-[0_0_20px_#f00] animate-pulse"
                        >
                            CONNECT NEURAL CHIP
                        </button>
                    </div>
                )}

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-lg font-bold font-['Consolas'] text-lg shadow-lg ${
                                msg.role === 'user' 
                                ? 'bg-red-900 text-white border-2 border-red-500 rounded-tr-none' 
                                : 'bg-blue-900 text-blue-100 border-2 border-blue-400 rounded-tl-none'
                            }`}>
                                {msg.role === 'model' && <div className="text-xs text-blue-300 mb-1 flex items-center gap-1"><Bot size={12}/> Miku</div>}
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-blue-900/50 text-blue-300 p-3 rounded-lg animate-pulse font-['Consolas']">
                                Miku sedang berpikir...
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-900 border-t-2 border-blue-500 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isKeySet ? "Ketik pesan untuk Miku..." : "KONEKSI TERPUTUS..."}
                        disabled={!isKeySet}
                        className="flex-1 bg-black border-2 border-blue-700 text-white p-3 rounded font-['Consolas'] focus:outline-none focus:border-blue-400 focus:shadow-[0_0_10px_#00f] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !isKeySet}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded border-2 border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MikuChat;