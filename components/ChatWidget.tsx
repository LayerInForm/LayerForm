import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Willkommen bei LayerForm! Haben Sie Fragen zu 3D-Druck, Materialien oder einem Projekt? Ich helfe Ihnen gerne weiter.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    const userMsg = trimmedInput;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Antwort");
      }

      const data = await response.json();
      const aiText = data.text || 'Entschuldigung, ich konnte Ihre Anfrage gerade nicht verarbeiten.';
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Error communicating with Gemini backend:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Unser Assistent ist momentan nicht erreichbar. Schreiben Sie uns gerne direkt via WhatsApp (+49 176 85922649) oder E-Mail (info@layer-form.de).' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {isOpen && (
        <div className="fixed sm:absolute bottom-20 right-4 sm:right-0 w-[calc(100vw-32px)] sm:w-[380px] h-[480px] max-h-[75vh] bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-fade-in z-50">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-[#0096C7]">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block">
                  LayerForm Assistent
                </span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Online &bull; Beratung</span>
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Chat schließen"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Message Area */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] px-4 py-2.5 rounded-2xl leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#0096C7] text-white rounded-tr-none shadow-2xs' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-2xl text-xs rounded-tl-none animate-pulse">
                  Antwort wird geladen...
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-2.5 sm:p-3 border-t border-slate-100 bg-white">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1 focus-within:border-[#0096C7] transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Frage stellen..." 
                className="w-full bg-transparent border-none outline-none text-base sm:text-xs text-slate-800 placeholder:text-slate-400 py-1.5"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="p-2 rounded-xl bg-[#0096C7] hover:bg-[#0077B6] disabled:opacity-40 text-white transition-all flex-shrink-0 min-w-[34px] min-h-[34px] flex items-center justify-center"
                aria-label="Nachricht senden"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-12 h-12 sm:w-13 sm:h-13 p-3 bg-slate-900 hover:bg-[#0096C7] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center active:scale-95 group border-2 border-white"
        aria-label="Chat öffnen"
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <MessageSquare size={20} className="group-hover:scale-105 transition-transform" />
        )}
      </button>
    </div>
  );
};
