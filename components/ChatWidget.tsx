import React, { useState, useRef, useEffect } from 'react';

interface ChatWidgetProps {
  isDarkMode: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isDarkMode }) => {
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
      setMessages(prev => [...prev, { role: 'ai', text: 'Unser KI-Assistent ist momentan ausgelastet. Kontaktieren Sie uns gerne direkt via WhatsApp oder E-Mail.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className={`absolute bottom-24 right-0 w-[350px] md:w-[420px] h-[600px] glass rounded-[48px] flex flex-col overflow-hidden animate-fade-in shadow-[0_30px_70px_rgba(0,0,0,0.6)] border ${
          isDarkMode ? 'border-white/10' : 'border-black/10'
        }`}>
          {/* Header */}
          <div className={`p-8 border-b flex justify-between items-center ${
            isDarkMode 
              ? 'border-white/5 bg-white/5' 
              : 'border-black/5 bg-black/[0.02]'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-2.5 h-2.5 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_12px_#00E5FF]"></div>
              <span className={`font-bold text-xs uppercase tracking-[0.3em] ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Project Assistant
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className={`p-2 transition-colors ${
                isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Message Area */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-8 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-5 rounded-[32px] text-sm leading-relaxed shadow-xl border ${
                  m.role === 'user' 
                    ? 'bg-[#00E5FF] text-black font-black rounded-tr-none border-[#00E5FF]' 
                    : `glass rounded-tl-none font-light ${
                        isDarkMode ? 'text-gray-200 border-white/10' : 'text-gray-800 border-black/10'
                      }`
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`glass px-6 py-5 rounded-[32px] rounded-tl-none flex space-x-2 border ${
                  isDarkMode ? 'border-white/10' : 'border-black/10'
                }`}>
                  <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Form Input Footer */}
          <div className={`p-8 border-t ${
            isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/[0.02]'
          }`}>
            <div className="relative">
              <input 
                className={`w-full px-8 py-5 border rounded-full text-sm outline-none transition-all pr-16 ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#00E5FF] focus:bg-white/10' 
                    : 'bg-black/[0.02] border-black/15 text-gray-800 placeholder:text-gray-400 focus:border-[#0097A7] focus:bg-black/[0.04]'
                }`} 
                placeholder="Projekt beschreiben..." 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
              />
              <button 
                onClick={handleSend}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform ${
                  isDarkMode 
                    ? 'bg-[#00E5FF] text-black shadow-[0_5px_20px_rgba(0,229,255,0.4)]' 
                    : 'bg-[#0097A7] text-white shadow-[0_5px_20px_rgba(0,151,167,0.3)]'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l7-7-7-7M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-20 h-20 glass rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-[1.15] active:scale-90 group border ${
          isDarkMode 
            ? 'border-white/10 text-white hover:border-[#00E5FF]/40' 
            : 'border-black/5 text-gray-800 hover:border-[#0097A7]/40 hover:text-[#0097A7]'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00E5FF] rounded-full border-2 border-[#050505] animate-ping"></div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};
