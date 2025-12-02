import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { Send, Bot } from 'lucide-react';

interface MikuChatProps {
    onBack: () => void;
}

const MikuChat: React.FC<MikuChatProps> = ({ onBack }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "H-hallo... Aku Miku Nakano. K-kamu... hacker ya? Tempat ini terlihat menyeramkan, tapi aku akan menemanimu." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API Key not found");
            }

            const ai = new GoogleGenAI({ apiKey });
            const model = "gemini-2.5-flash"; // Use generic flash for character roleplay
            
            // Construct history for context
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
            setMessages(prev => [...prev, { role: 'model', text: "Maaf... a-aku kehilangan koneksi dengan World Brain... (Error)" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-100px)] flex flex-col">
            <h1 className="text-3xl md:text-5xl font-['Press_Start_2P'] text-blue-400 text-center mb-8 drop-shadow-[4px_4px_0_#0000ff]">
                MIKU NAKANO AI
            </h1>

            <div className="flex-1 bg-black border-4 border-blue-500 rounded-xl overflow-hidden shadow-[0_0_30px_#0000ff] flex flex-col">
                
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-lg font-bold font-['Consolas'] text-lg ${
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
                             <div className="bg-blue-900/50 text-blue-300 p-3 rounded-lg animate-pulse">
                                Miku sedang mengetik...
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
                        placeholder="Ketik pesan untuk Miku..."
                        className="flex-1 bg-black border-2 border-blue-700 text-white p-3 rounded font-['Consolas'] focus:outline-none focus:border-blue-400 focus:shadow-[0_0_10px_#00f]"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded border-2 border-blue-300 transition-colors disabled:opacity-50"
                    >
                        <Send />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MikuChat;