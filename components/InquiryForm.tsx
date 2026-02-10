
import React, { useState, useEffect } from 'react';

interface InquiryFormProps {
  initialProduct?: string;
  initialPersonalization?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialProduct, initialPersonalization }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    category: 'Individuelle Fertigung',
    description: '',
    quantity: 'Einzelstück (1-5)',
    priority: 'Standard',
    requirement: 'Ästhetik & Design'
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({
        ...prev,
        category: initialProduct,
        description: initialPersonalization || ''
      }));
    }
  }, [initialProduct, initialPersonalization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectOption = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const subject = encodeURIComponent(`Projektanfrage: ${formData.category} - ${formData.company || fullName}`);
    const body = encodeURIComponent(
      `Hallo Benjamin,\n\n` +
      `Ich habe eine neue Projektanfrage für LayerForm:\n\n` +
      `• Vorhaben: ${formData.category}\n` +
      `• Stückzahl: ${formData.quantity}\n` +
      `• Fokus: ${formData.requirement}\n` +
      `• Dringlichkeit: ${formData.priority}\n` +
      `• Unternehmen: ${formData.company || 'Privat'}\n\n` +
      `Beschreibung:\n${formData.description}\n\n` +
      `Kontaktdaten:\n` +
      `${fullName}\nE-Mail: ${formData.email}\n\n` +
      `Ich freue mich auf eine Rückmeldung zur Machbarkeit.`
    );

    window.location.href = `mailto:layerform@web.de?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center animate-fade-in">
        <div className="w-20 h-20 bg-[#00E5FF]/10 text-[#00E5FF] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Anfrage vorbereitet.</h2>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed font-light">
          Dein E-Mail-Programm öffnet sich. Bitte klicke dort auf Senden.<br />
          Du kannst dort auch direkt deine CAD-Dateien (STL/STEP) oder Logos anhängen.
        </p>
        <button onClick={() => setIsSubmitted(false)} className="bg-black text-white px-10 py-4 rounded-full font-bold">Neue Anfrage</button>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
      <div className="text-center mb-20">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] mb-4 block">Projekt-Konfigurator</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#1d1d1f]">Ihre Vision realisieren.</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Präzise Abfrage für exzellente Ergebnisse. Beschreiben Sie Ihr Vorhaben – wir finden die fertigungstechnische Lösung.
        </p>
      </div>

      <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-50">
          {[1, 2].map(i => (
            <div key={i} className={`flex-1 py-4 text-center text-[10px] font-bold uppercase tracking-widest ${step === i ? 'text-[#00E5FF] bg-blue-50/30' : 'text-gray-300'}`}>
              Schritt {i}: {i === 1 ? 'Projekt-Details' : 'Kontakt'}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-16">
          {step === 1 && (
            <div className="space-y-12 animate-fade-in">
              {/* Kategorie-Auswahl */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-6">Was möchten Sie umsetzen?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {id: 'Branding', label: 'Corporate Branding', sub: 'Logos, Schilder, Merch'},
                    {id: 'Prototyping', label: 'Techn. Prototyping', sub: 'Funktionsteile, Gehäuse'},
                    {id: 'Event', label: 'Event & Ausstattung', sub: 'Pokale, Deko, Aufsteller'}
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectOption('category', cat.label)}
                      className={`p-6 rounded-[24px] border-2 text-left transition-soft ${formData.category === cat.label ? 'border-black bg-black text-white shadow-xl scale-[1.02]' : 'border-gray-50 hover:border-gray-200'}`}
                    >
                      <div className="font-bold text-sm mb-1">{cat.label}</div>
                      <div className={`text-[11px] ${formData.category === cat.label ? 'text-gray-400' : 'text-gray-400'}`}>{cat.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Stückzahl */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-6">Geplante Stückzahl</label>
                  <div className="flex flex-wrap gap-3">
                    {['Einzelstück (1-5)', 'Kleinserie (6-50)', 'Serie (50+)'].map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => selectOption('quantity', q)}
                        className={`px-6 py-3 rounded-full border text-xs font-bold transition-soft ${formData.quantity === q ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fokus */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-6">Hauptanforderung</label>
                  <div className="flex flex-wrap gap-3">
                    {['Ästhetik & Design', 'Funktion & Belastung', 'Kosteneffizienz'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => selectOption('requirement', r)}
                        className={`px-6 py-3 rounded-full border text-xs font-bold transition-soft ${formData.requirement === r ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Beschreibung */}
              <div className="group">
                <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-4">Projektbeschreibung</label>
                <textarea 
                  name="description" 
                  rows={4} 
                  required 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full px-6 py-4 rounded-3xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#00E5FF] transition-all text-lg resize-none" 
                  placeholder="Beschreiben Sie Ihre Idee, Maße oder technische Vorgaben..." 
                />
              </div>

              <div className="flex justify-end pt-8">
                <button type="button" onClick={() => setStep(2)} className="bg-black text-white px-12 py-5 rounded-full font-bold flex items-center group shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-soft">
                  Weiter zum Kontakt
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Vorname *</label>
                    <input name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg" placeholder="Max" />
                  </div>
                  <div className="group">
                    <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Nachname *</label>
                    <input name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg" placeholder="Mustermann" />
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Unternehmen (für B2B)</label>
                    <input name="company" type="text" value={formData.company} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg" placeholder="Beispiel GmbH" />
                  </div>
                  <div className="group">
                    <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Deine E-Mail *</label>
                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg" placeholder="name@email.com" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-12">
                <button type="button" onClick={() => setStep(1)} className="text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-black transition-colors">Zurück</button>
                <button type="submit" className="w-full sm:w-auto bg-[#00E5FF] text-white px-16 py-6 rounded-full font-bold text-lg shadow-xl hover:bg-[#00B8D4] hover:scale-[1.02] active:scale-95 transition-soft">
                  Konfiguration abschließen
                </button>
              </div>
              <p className="text-center text-[11px] text-gray-400 italic">Wir prüfen jede Anfrage persönlich und melden uns werktags innerhalb von 24h.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
