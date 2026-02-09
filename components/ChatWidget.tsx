
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Willkommen bei LayerForm. Ich bin Ihr Assistent für Präzisions-3D-Druck. Wie kann ich Ihnen heute helfen?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Du bist der offizielle KI-Assistent von "LayerForm", einer Premium 3D-Druck Manufaktur (Inhaber Benjamin Ridel).
          Dein Ziel: Kunden beraten, Möglichkeiten aufzeigen und Fragen beantworten.
          Wichtige Fakten:
          - Standort: Bargteheide (Ludwig-Bechstein-Weg 25a). Erwähne den Standort Bargteheide nur, wenn Kunden explizit nach dem Ort oder der Abholung fragen.
          - Materialien: Carbon-faserverstärktes Nylon (extrem stabil), PLA, PETG, Resin (hochpräzise), ABS.
          - Services: Individuelle 3D-Drucke, CAD-Konstruktion, Rapid Prototyping, Kleinserien.
          - Produkte im Shop: Puzzle-Herz Schlüsselanhänger, MagSafe Desk Stand, Stealth Headset-Halterung, Luna Planter.
          - Tonalität: Professionell, minimalistisch, freundlich und hilfsbereit. Antworte prägnant im Apple-Stil.
          - Wenn Kunden nach Preisen fragen, verweise auf den Shop oder die individuelle Anfrage.`,
        }
      });

      const responseStream = await chat.sendMessageStream({ message: userMessage });
      
      let aiText = '';
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      for await (const chunk of responseStream) {
        const textChunk = chunk.text;
        aiText += textChunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = aiText;
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Entschuldigung, ich habe gerade eine technische Störung. Bitte versuchen Sie es gleich noch einmal oder nutzen Sie das Kontaktformular.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
            <div>
              <h3 className="font-bold text-[#001C3D]">LayerForm Assistent</h3>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black transition-soft">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-[#001C3D] text-white rounded-tr-none' 
                  : 'bg-gray-100 text-[#1d1d1f] rounded-tl-none'
                }`}>
                  {m.text || (isTyping && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length-1].role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-[20px] rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Fragen Sie etwas..."
                className="w-full pl-4 pr-12 py-3 bg-[#f5f5f7] border-none rounded-full focus:ring-2 focus:ring-[#00E5FF] transition-soft text-sm outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#001C3D] text-white rounded-full flex items-center justify-center hover:bg-black transition-soft disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-black rotate-90' : 'bg-[#001C3D] hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? (
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#001C3D] rounded-full"></span>
          </div>
        )}
      </button>
    </div>
  );
};
