import React, { useState, useEffect } from 'react';
import { CONTACT_EMAIL, WHATSAPP_LINK } from '../src/constants';
import { Mail, MessageSquare, Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface InquiryFormProps {
  initialProduct?: string;
  initialPersonalization?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialProduct, initialPersonalization }) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: initialPersonalization || (initialProduct ? `Anfrage zum Produkt: ${initialProduct}` : ''),
    material: 'Standard (PETG / PLA)',
    quantity: '1'
  });

  useEffect(() => {
    if (initialPersonalization || initialProduct) {
      setFormData(prev => ({
        ...prev,
        description: initialPersonalization || (initialProduct ? `Anfrage zum Produkt: ${initialProduct}` : prev.description)
      }));
    }
  }, [initialPersonalization, initialProduct]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const generateMailBody = () => {
    return `Hallo LayerForm Team,

ich möchte ein 3D-Druck Projekt anfragen:

• Name / Firma: ${formData.name || '-'}
• E-Mail: ${formData.email || '-'}
• Telefon: ${formData.phone || '-'}
• Stückzahl: ${formData.quantity || '1'}
• Material: ${formData.material}

Projektbeschreibung / Maße / Anforderungen:
${formData.description}

(3D-Dateien wie .STEP, .STL oder Skizzen im Anhang dieser E-Mail)`;
  };

  const getMailtoLink = () => {
    const subject = `3D-Druck Anfrage: ${formData.name || 'Neues Projekt'}`;
    const body = generateMailBody();
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getWhatsAppLink = () => {
    const text = `Hallo LayerForm! Ich möchte ein 3D-Druck Projekt anfragen:\n\n*Name:* ${formData.name}\n*E-Mail:* ${formData.email}\n*Stückzahl:* ${formData.quantity}\n*Material:* ${formData.material}\n\n*Details:*\n${formData.description}`;
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  };

  const handleOpenMail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = getMailtoLink();
    window.location.href = mailto;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateMailBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="inquiry" className="max-w-3xl mx-auto py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="mb-8 sm:mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full mb-3 inline-block">
          Projektanfrage
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 mt-1">
          E-Mail Anfrage vorbereiten.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal px-2">
          Geben Sie Ihre Projektdaten ein. Die Nachricht wird direkt in Ihrer E-Mail App mit allen Angaben geöffnet.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200 shadow-2xs">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 1 ? 'bg-[#0096C7] text-white' : 'bg-emerald-500 text-white'
            }`}>
              1
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Kontaktdaten</span>
          </div>
          <div className="w-8 sm:w-12 h-0.5 bg-slate-200 mx-2" />
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-[#0096C7] text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Projektdetails</span>
          </div>
        </div>

        <form onSubmit={handleOpenMail} className="space-y-5 sm:space-y-6">
          {step === 1 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Name / Firma *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0096C7] focus:bg-white text-slate-900 text-base sm:text-sm transition-colors"
                    placeholder="Max Mustermann"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">E-Mail Adresse *</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0096C7] focus:bg-white text-slate-900 text-base sm:text-sm transition-colors"
                    placeholder="name@example.de"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Telefonnummer (optional)</label>
                <input 
                  type="tel" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0096C7] focus:bg-white text-slate-900 text-base sm:text-sm transition-colors"
                  placeholder="+49 ..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="pt-3 sm:pt-4 flex justify-end">
                <button 
                  type="button" 
                  onClick={handleNext} 
                  disabled={!formData.name || !formData.email}
                  className="w-full sm:w-auto bg-[#0096C7] hover:bg-[#0077B6] disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold text-sm transition-colors shadow-2xs flex items-center justify-center space-x-2 min-h-[48px] active:scale-98"
                >
                  <span>Weiter zu Projektdetails</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Beschreibung &amp; Bauteildetails *</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#0096C7] focus:bg-white text-slate-900 text-base sm:text-sm transition-colors resize-none"
                  placeholder="Beschreiben Sie Ihr Bauteil, Maße, gewünschte Funktion oder Anforderungen..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Material / Wunsch</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0096C7] focus:bg-white text-slate-900 text-base sm:text-sm transition-colors"
                    value={formData.material}
                    onChange={e => setFormData({...formData, material: e.target.value})}
                  >
                    <option value="Standard (PETG / PLA)">Standard (PETG / PLA)</option>
                    <option value="Hitze- & Wetterfest (ABS / ASA)">Hitze- &amp; Wetterfest (ABS / ASA)</option>
                    <option value="Flexibel (TPU Gummi)">Flexibel (TPU Gummi)</option>
                    <option value="Carbonfaser-verstärkt (CF)">Carbonfaser-verstärkt (CF)</option>
                    <option value="Beratung erwünscht">Beratung erwünscht</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stückzahl</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#0096C7] focus:bg-white text-slate-900 text-base sm:text-sm transition-colors"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
              </div>

              {/* Preview of the ready Mail text */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Vorschau der E-Mail Nachricht
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex items-center space-x-1 text-[#0096C7] hover:text-[#0077B6] font-bold text-[11px] p-1 -m-1"
                  >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{copied ? 'Kopiert!' : 'Text kopieren'}</span>
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto leading-relaxed text-[11px]">
                  {generateMailBody()}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="order-2 sm:order-1 px-5 py-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all flex items-center justify-center space-x-2 min-h-[44px]"
                >
                  <ArrowLeft size={16} />
                  <span>Zurück</span>
                </button>

                <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center space-x-2 min-h-[48px] active:scale-98"
                  >
                    <MessageSquare size={16} />
                    <span>Per WhatsApp senden</span>
                  </a>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#0096C7] hover:bg-[#0077B6] text-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center space-x-2 min-h-[48px] active:scale-98"
                  >
                    <Mail size={16} />
                    <span>In E-Mail App öffnen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
