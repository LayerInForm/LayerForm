
import React, { useState, useEffect } from 'react';

interface InquiryFormProps {
  initialProduct?: string;
  initialPersonalization?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialProduct, initialPersonalization }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Retrieve access key from env or a direct fallback if you have one
    const accessKey = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || "a6d8c437-788b-464a-a29b-4985a7e3f247";

    if (!accessKey) {
      // If no API key is specified, show the helpful fallback options
      setSubmitError("No_Key");
      setIsSubmitting(false);
      return;
    }

    try {
      const dataObj = new FormData();
      dataObj.append("access_key", accessKey);
      dataObj.append("subject", `Neue LayerForm Anfrage von ${formData.name}`);
      dataObj.append("from_name", formData.name);
      dataObj.append("name", formData.name);
      dataObj.append("email", formData.email);
      dataObj.append("material", formData.material);
      dataObj.append("message", formData.description);

      if (formData.file) {
        dataObj.append("file", formData.file);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: dataObj,
      });

      const responseData = await response.json();

      if (responseData.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(responseData.message || "Übertragungsfehler");
      }
    } catch (err: any) {
      console.error("Fehler beim Versenden der Anfrage:", err);
      // Fallback to error state
      setSubmitError("Failed_API");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMailtoLink = () => {
    return `mailto:layerform@web.de?subject=Anfrage: ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
      `Hallo LayerForm Team,\n\nich möchte eine Anfrage stellen.\n\nName: ${formData.name}\nE-Mail: ${formData.email}\nMaterial: ${formData.material}\n\nBeschreibung / Anforderungen:\n${formData.description}\n\n[Bitte hängen Sie Ihre Modelldateien (STL/STEP) an diese E-Mail an, wenn vorhanden.]`
    )}`;
  };

  const getWhatsAppLink = () => {
    const text = `Hallo LayerForm! Ich möchte eine 3D-Druck Anfrage stellen.\n\n*Name:* ${formData.name}\n*E-Mail:* ${formData.email}\n*Material:* ${formData.material}\n\n*Details:* ${formData.description}`;
    return `https://wa.me/4915565994781?text=${encodeURIComponent(text)}`;
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-6 text-center animate-fade-in text-white">
        <div className="w-24 h-24 bg-[#00E5FF]/20 rounded-[32px] flex items-center justify-center mx-auto mb-10">
          <svg className="w-12 h-12 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-5xl font-bold mb-6">Anfrage versendet</h2>
        <p className="text-gray-400 text-xl mb-12 font-light leading-relaxed">Vielen Dank für Ihr Vertrauen! Ihre Anfrage wurde erfolgreich per E-Mail an uns übermittelt. Wir prüfen Ihre Anforderungen und die Machbarkeit Ihrer Dateien und melden uns schnellstmöglich bei Ihnen.</p>
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

              {submitError && (
                <div className="p-6 md:p-8 bg-black/40 border border-[#00E5FF]/20 rounded-[24px] md:rounded-[32px] text-left space-y-4">
                  <div className="flex items-center space-x-3 text-[#00E5FF]">
                    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="font-bold text-base md:text-lg">Anfrage absenden</h4>
                  </div>
                  <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
                    {submitError === "No_Key" 
                      ? "Das Web-Formular ist bereit! Um Anfragen als automatisierte E-Mails zu erhalten, richten Sie einfach Ihren kostenlosen Web3Forms-Schlüssel in der .env ein. Bis dahin können Sie Ihre eingegebenen Daten sofort direkt an uns senden:"
                      : "Ein Übertragungsfehler ist aufgetreten. Senden Sie uns Ihre Anfrage bitte direkt per E-Mail oder WhatsApp:"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <a 
                      href={getMailtoLink()}
                      className="flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span>Per E-Mail senden</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                    <a 
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span>Per WhatsApp senden</span>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.033 1.397 4.604 1.398 5.233 0 9.492-4.259 9.494-9.493.002-5.233-4.258-9.492-9.493-9.493-2.535 0-4.918.988-6.71 2.781-1.791 1.792-2.777 4.174-2.778 6.709-.001 1.664.47 3.248 1.36 4.632l-.899 3.28 3.422-.894zm11.233-6.578c-.092-.153-.339-.244-.712-.431-.372-.187-2.199-1.085-2.541-1.209-.341-.125-.59-.187-.838.187-.248.374-.959 1.209-1.176 1.458-.216.248-.433.279-.806.092-.373-.187-1.573-.581-2.996-1.851-1.107-.988-1.855-2.207-2.071-2.58-.217-.373-.023-.574.164-.76.168-.168.373-.434.56-.651.186-.217.248-.372.372-.62.124-.248.062-.465-.031-.652-.093-.187-.838-2.016-1.148-2.761-.303-.728-.61-.63-.838-.641-.216-.011-.465-.013-.713-.013-.248 0-.651.093-.991.465-.34.372-1.299 1.271-1.299 3.102 0 1.83 1.332 3.6 1.518 3.849.187.248 2.622 4.004 6.353 5.613.888.383 1.58.611 2.119.783.892.283 1.703.243 2.345.147.715-.107 2.199-.899 2.509-1.768.311-.869.311-1.613.217-1.768z" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-4 md:pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button 
                  type="button" 
                  onClick={handleBack} 
                  disabled={isSubmitting}
                  className="text-gray-500 font-bold hover:text-[#00E5FF] transition-colors underline underline-offset-8 decoration-2 text-sm md:text-base mr-auto sm:mr-0 pl-1 disabled:opacity-50"
                >
                  Zurück
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#00E5FF] text-black px-10 py-4.5 md:px-16 md:py-6 rounded-full font-bold text-base md:text-lg hover:scale-105 active:scale-95 transition-soft disabled:opacity-50 disabled:scale-100 shadow-[0_0_50px_rgba(0,229,255,0.4)] flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Wird übertragen...</span>
                    </>
                  ) : (
                    <span>Anfrage jetzt absenden</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
