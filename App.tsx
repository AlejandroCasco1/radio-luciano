import React, { useState, useRef, useEffect } from 'react';
import { VOICES, ACCENTS, STYLES, TAGS } from './constants';
import { AudioEntry, GenerationSettings, VoiceOption } from './types';
import { generateSpeech } from './services/geminiService';
import HistoryItem from './components/HistoryItem';
import { AudioLines, Loader2, Mic, Settings2, Sliders, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [text, setText] = useState<string>('Hola, este es un ejemplo de texto para convertir a voz. [risa] ¡Es increíble!');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICES[0].id);
  const [settings, setSettings] = useState<GenerationSettings>({
    voiceId: VOICES[0].id,
    accent: ACCENTS[0],
    style: STYLES[0],
    speed: 1.0,
    pitch: 0,
  });
  const [history, setHistory] = useState<AudioEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  // Handlers
  const handleTagInsert = (tagLabel: string) => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const newText = text.substring(0, start) + tagLabel + text.substring(end);
      setText(newText);
      // Re-focus and move cursor
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
          textAreaRef.current.setSelectionRange(start + tagLabel.length, start + tagLabel.length);
        }
      }, 0);
    } else {
      setText(prev => prev + tagLabel);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const voiceOption = VOICES.find(v => v.id === selectedVoiceId) || VOICES[0];
      const blob = await generateSpeech(text, { ...settings, voiceId: selectedVoiceId }, voiceOption);
      const url = URL.createObjectURL(blob);
      
      const newEntry: AudioEntry = {
        id: Date.now().toString(),
        text: text,
        blobUrl: url,
        timestamp: Date.now(),
        settings: {
          voice: voiceOption.name,
          accent: settings.accent,
          style: settings.style,
        }
      };

      setHistory(prev => [newEntry, ...prev]);
      setCurrentAudioUrl(url);
      
      // Auto play
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play();
      }

    } catch (error) {
      alert("Hubo un error generando el audio. Por favor verifica tu API Key o intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handlePlayHistory = (url: string) => {
    setCurrentAudioUrl(url);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-10 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <AudioLines className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              IA Texto a Voz
            </h1>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            Potenciado por Gemini 2.5 Flash TTS
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Input Area */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Mic size={18} className="text-indigo-400"/> Contenido
              </h2>
              <span className="text-xs text-gray-400">{text.length} caracteres</span>
            </div>
            
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-sans leading-relaxed"
              placeholder="Escribe aquí el texto que quieres convertir a voz..."
            />

            {/* Tags Toolbar */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Etiquetas de Efectos (Clic para insertar)</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleTagInsert(tag.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-xs text-gray-300 transition-all hover:border-indigo-500 group"
                    title={tag.desc}
                  >
                    <tag.icon size={12} className="text-indigo-400 group-hover:text-indigo-300" />
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Voice & Accent */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
              <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-gray-200">
                <Settings2 size={18} /> Configuración de Voz
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Voz (5H / 5M)</label>
                  <select
                    value={selectedVoiceId}
                    onChange={(e) => setSelectedVoiceId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <optgroup label="Masculino">
                      {VOICES.filter(v => v.gender === 'male').map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Femenino">
                      {VOICES.filter(v => v.gender === 'female').map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Acento (Regional)</label>
                  <select
                    value={settings.accent}
                    onChange={(e) => setSettings({...settings, accent: e.target.value as any})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {ACCENTS.map(accent => (
                      <option key={accent} value={accent}>{accent}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estilo</label>
                  <select
                    value={settings.style}
                    onChange={(e) => setSettings({...settings, style: e.target.value as any})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {STYLES.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Speed & Pitch */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
              <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-gray-200">
                <Sliders size={18} /> Ajustes Finos
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-400">Velocidad</label>
                    <span className="text-xs text-indigo-400 font-mono">{settings.speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) => setSettings({...settings, speed: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Lento</span>
                    <span>Rápido</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-400">Tono</label>
                    <span className="text-xs text-indigo-400 font-mono">{settings.pitch}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={settings.pitch}
                    onChange={(e) => setSettings({...settings, pitch: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Grave</span>
                    <span>Agudo</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !text.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99]
              ${isLoading || !text.trim()
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Generando Audio...
              </>
            ) : (
              <>
                <Volume2 /> Generar Voz
              </>
            )}
          </button>
          
          {/* Hidden Player for instant feedback */}
          <audio ref={audioPlayerRef} className="hidden" controls />

        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-800 pb-2">
              Historial de Audios
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <AudioLines size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Aún no has generado audios.</p>
                </div>
              ) : (
                history.map(item => (
                  <HistoryItem 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDeleteHistory}
                    onPlay={handlePlayHistory}
                  />
                ))
              )}
            </div>
          </div>
        </div>

      </main>

      <footer className="mt-auto py-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>Hecho por Germán A. Casco by Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
