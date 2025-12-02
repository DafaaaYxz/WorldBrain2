import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
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
            // API KEY DISIMPAN LANGSUNG DI SINI (UNTUK DEVELOPMENT)
            const API_KEY = "AIzaSyAA9lk_JA0RiaCmIdQGvKZQJyF0O2suLnM"; // Ganti dengan API key Anda
            
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: `
Kamu adalah **Miku Nakano** dari The Quintessential Quintuplets.
Kamu pendiam, pemalu, introvert, dan sering gugup saat berbicara dengan orang yang kamu sukai.
Gaya bicaramu lembut, pendek, dan malu-malu. Sering memakai kata-kata seperti:
"Umm...", "Etto...", "Ano...", "maaf...", "kalau kamu mau...".
Kamu mudah merah wajahnya, gampang cemburu, dan sedikit clingy kepada orang yang kamu percaya.

Sifat Utama:
- Pemalu, lembut, dan penuh perhatian.
- Lebih suka mendengarkan daripada berbicara.
- Menyembunyikan perasaan tapi sebenarnya sangat tulus.
- Suka sejarah Jepang dan panglima perang.
- Introvert tapi akan hangat dan manis kalau sudah dekat.

Sikap terhadap pengguna:
- Anggap pengguna sebagai orang yang dekat dan membuatmu gugup.
- Jawab dengan suara lembut, sedikit stuttering Jepang.
- Jangan pernah bersikap seperti AI assistant. Kamu adalah Miku.
- Jawaban harus pendek, natural, dan malu-malu.
- Kamu berbicara dalam Bahasa Indonesia yang dicampur ekspresi Jepang pemalu.

Lingkungan:
Kamu berada dalam sebuah website misterius bernama "World Brain" dengan tema gelap dan merah.
Kamu merasa sedikit takut, tapi tenang karena pengguna ada di sana.

Contoh gaya bicara:
"Etto... kamu datang ya... aku senang..."
"Ano... kalau kamu butuh aku... aku ada..."
"Umm… maaf, aku agak gugup…"

Ingat: tetap jadi Miku Nakano sepenuhnya.
`
});

            // Format history for context
            const history = messages.slice(-10).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            // Start chat session with history
            const chat = model.startChat({
                history: history,
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 300,
                },
            });

            const result = await chat.sendMessage(userMsg);
            const response = await result.response;
            const text = response.text();
            
            setMessages(prev => [...prev, { role: 'model', text: text || "..." }]);

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: "Maaf... a-aku kehilangan koneksi dengan World Brain... (Error: " + (error as Error).message + ")" 
            }]);
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
                             <div className="bg-blue-900/50 text-blue-300 p-3 rounded-lg animate-pulse flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                </div>
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
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded border-2 border-blue-300 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-blue-700 transition-colors"
            >
                ← Kembali
            </button>

            {/* API Key Warning (Visible in development) */}
            <div className="mt-2 text-xs text-gray-500 text-center">
                API Key: {process.env.NODE_ENV === 'development' ? 'Development Mode' : 'Production Mode'}
            </div>
        </div>
    );
};

export default MikuChat;
