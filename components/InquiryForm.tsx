
import React, { useState, useEffect } from 'react';

interface InquiryFormProps {
  initialProduct?: string;
  initialPersonalization?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialProduct, initialPersonalization }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: initialPersonalization || '',
    material: 'PLA',
    quantity: '1',
    file: null as File | null
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-6 text-center animate-fade-in text-white">
        <div className="w-24 h-24 bg-[#00E5FF]/20 rounded-[32px] flex items-center justify-center mx-auto mb-10">
          <svg className="w-12 h-12 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-5xl font-bold mb-6">Anfrage versendet</h2>
        <p className="text-gray-400 text-xl mb-12 font-light leading-relaxed">Vielen Dank für Ihr Vertrauen. Wir prüfen Ihre Anforderungen und die Machbarkeit Ihrer Dateien und melden uns schnellstmöglich bei Ihnen.</p>
        <button onClick={() => window.location.reload()} className="bg-white text-black px-12 py-5 rounded-full font-bold hover:scale-[1.05] transition-soft">Zurück zur Startseite</button>
      </div>
    );
  }

  return (
    <div id="inquiry" className="max-w-4xl mx-auto py-24 md:py-48 px-4 md:px-6">
      <div className="mb-12 md:mb-24 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-4 md:mb-6 block">Projektstart</span>
        <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight mb-4 md:mb-8">Anfrage starten</h2>
        <p className="text-gray-400 text-sm md:text-xl font-light max-w-2xl mx-auto leading-relaxed px-2">
          Senden Sie uns Ihre Datei oder Idee. Wir kontaktieren Sie persönlich via Chat oder Telefon, um die perfekte Lösung für Sie zu konstruieren.
        </p>
      </div>

      <div className="glass rounded-[32px] md:rounded-[64px] p-6 sm:p-12 md:p-20 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-10 md:space-y-16">
          {step === 1 && (
            <div className="space-y-8 md:space-y-12 animate-fade-in">
              <h3 className="text-xl md:text-3xl font-bold pb-4 md:pb-8 border-b border-white/5">01 Kontakte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] ml-4 md:ml-6">Name / Firma</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 md:px-10 md:py-6 focus:outline-none focus:border-[#00E5FF] transition-all text-inherit text-sm md:text-lg"
                    placeholder="Max Mustermann"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] ml-4 md:ml-6">E-Mail Adresse</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 md:px-10 md:py-6 focus:outline-none focus:border-[#00E5FF] transition-all text-inherit text-sm md:text-lg"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 md:pt-8 flex justify-end">
                <button type="button" onClick={handleNext} className="w-full sm:w-auto bg-[#00E5FF] text-black px-10 py-4.5 md:px-16 md:py-6 rounded-full font-bold text-base md:text-lg hover:scale-105 transition-soft shadow-xl">Weiter zur Beschreibung →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 md:space-y-12 animate-fade-in">
              <h3 className="text-xl md:text-3xl font-bold pb-4 md:pb-8 border-b border-white/5">02 Projektdetails</h3>
              <div className="space-y-3 md:space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] ml-4 md:ml-6">Beschreibung & Anforderungen</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] md:rounded-[40px] px-6 py-4 md:px-10 md:py-8 focus:outline-none focus:border-[#00E5FF] transition-all text-inherit text-sm md:text-lg leading-relaxed resize-none"
                  placeholder="Beschreiben Sie Ihr Projekt, gewünschte Maße, Farbe oder Verwendungszweck..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] ml-4 md:ml-6">Material (Optional)</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 md:px-10 md:py-6 focus:outline-none focus:border-[#00E5FF] appearance-none text-inherit cursor-pointer text-sm md:text-lg"
                    value={formData.material}
                    onChange={e => setFormData({...formData, material: e.target.value})}
                  >
                    <option value="PLA" className="bg-[#0d0d0d] text-white">PLA (Standard)</option>
                    <option value="PETG" className="bg-[#0d0d0d] text-white">PETG (Stabil)</option>
                    <option value="ABS" className="bg-[#0d0d0d] text-white">ABS (Hitzebeständig)</option>
                  </select>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] ml-4 md:ml-6">Datei hochladen (STL/STEP/Design)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})}
                    />
                    <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-full px-6 py-4 md:px-10 md:py-6 group-hover:border-[#00E5FF]/50 transition-all text-center">
                      <span className="text-sm md:text-base text-gray-400 group-hover:text-inherit line-clamp-1 block">
                        {formData.file ? formData.file.name : 'Datei oder Bild hochladen'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 md:pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button type="button" onClick={handleBack} className="text-gray-500 font-bold hover:text-[#00E5FF] transition-colors underline underline-offset-8 decoration-2 text-sm md:text-base mr-auto sm:mr-0 pl-1">Zurück</button>
                <button type="submit" className="w-full sm:w-auto bg-[#00E5FF] text-black px-10 py-4.5 md:px-16 md:py-6 rounded-full font-bold text-base md:text-lg hover:scale-105 transition-soft shadow-[0_0_50px_rgba(0,229,255,0.4)]">Anfrage jetzt absenden</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
