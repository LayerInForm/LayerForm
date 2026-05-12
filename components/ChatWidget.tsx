
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Willkommen bei LayerForm. Wir machen fast alles im 3D-Druck möglich. Was haben Sie für ein Projekt geplant?' }
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
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        throw new Error("Missing API Key");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Du bist der Assistent von 'LayerForm' (Bargteheide). Deine Aufgabe: Berate Kunden zu INDIVIDUELLEN FERTIGUNGEN. Unser Motto: 'Alles ist möglich'. Wir fertigen Einzelstücke und Kleinserien für Privatpersonen und Unternehmen (B2B). Wir drucken Logos, Prototypen, Ersatzteile, Event-Deko und vieles mehr auf Bambu Lab Systemen. Sei lösungsorientiert: Wenn ein Kunde fragt, ob wir X drucken können, antworte positiv und lade ihn ein, uns Details via WhatsApp oder E-Mail zu schicken. Stil: Edel, Apple-Style, minimalistisch, professionell.",
        }
      });
      
      const aiText = response?.text || 'Entschuldigung, ich konnte Ihre Anfrage gerade nicht verarbeiten.';
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Unser KI-Assistent ist momentan ausgelastet. Kontaktieren Sie uns gerne direkt via WhatsApp oder E-Mail.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[350px] md:w-[420px] h-[600px] glass rounded-[48px] border-white/10 flex flex-col overflow-hidden animate-fade-in shadow-[0_30px_70px_rgba(0,0,0,0.8)]">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-2.5 h-2.5 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_12px_#00E5FF]"></div>
              <span className="font-bold text-xs uppercase tracking-[0.3em] text-white">Project Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-8 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-5 rounded-[32px] text-sm leading-relaxed shadow-xl ${
                  m.role === 'user' 
                    ? 'bg-[#00E5FF] text-black font-black rounded-tr-none' 
                    : 'glass text-gray-200 border-white/10 rounded-tl-none font-light'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass border-white/10 px-6 py-5 rounded-[32px] rounded-tl-none flex space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white/5 border-t border-white/5">
            <div className="relative">
              <input 
                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-full text-sm outline-none focus:border-[#00E5FF] transition-all pr-16 text-white placeholder:text-gray-600 focus:bg-white/10" 
                placeholder="Projekt beschreiben..." 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#00E5FF] text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-[0_5px_20px_rgba(0,229,255,0.4)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l7-7-7-7M5 12h14" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-20 h-20 glass border-white/10 text-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-[1.15] hover:border-[#00E5FF]/40 active:scale-90 group"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00E5FF] rounded-full border-2 border-[#050505] animate-ping"></div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
        )}
      </button>
    </div>
  );
};
